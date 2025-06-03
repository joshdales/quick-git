import { useMemo } from "react"
import { ActionPanel, List } from "@raycast/api"
import { showFailureToast, useExec } from "@raycast/utils"
import type { GitStatus } from "../../utils/status.js"
import { parseGitStatus } from "../../utils/status.js"
import { useRepo } from "../../hooks/useRepo.js"
import { SwitchBranch } from "../actions/SwitchBranch.js"
import { ChangeCurrentRepo } from "../actions/ChangeCurrentRepo.js"
import { GitStatusItem } from "./GitStatusItem.js"
import { RemoteGitActions } from "./RemoteGitActions.js"
import { GitStatusEmpty } from "./GitStatusEmpty.js"

export function GitStatus() {
	const { value: repo, isLoading: isLoadingRepo } = useRepo()
	const { data, isLoading, revalidate } = useExec(
		"git",
		["status", "--porcelain=2", "--branch"],
		{
			cwd: repo,
			execute: !!repo,
			keepPreviousData: false,
			onError: (error) => {
				showFailureToast(error, { title: "Could not fetch git status" })
			},
			parseOutput: ({ stdout }) => parseGitStatus(stdout),
		},
	)

	const changeRepoTitle = useMemo(() => {
		return repo ? undefined : "Set Repo"
	}, [repo])

	return (
		<List
			searchBarPlaceholder="Search modified files…"
			navigationTitle="Git Status"
			isShowingDetail={!!repo && !!data?.files.length}
			isLoading={isLoadingRepo || isLoading}
			actions={
				<ActionPanel>
					{repo ? (
						<>
							<SwitchBranch checkStatus={revalidate} />
							<RemoteGitActions checkStatus={revalidate} />
						</>
					) : null}
					<ChangeCurrentRepo title={changeRepoTitle} />
				</ActionPanel>
			}
		>
			{repo && data?.files.length ? (
				data.files.map((item) => {
					return (
						<GitStatusItem
							key={item.fileName}
							repo={repo}
							status={item}
							branch={data.branch}
							checkStatus={revalidate}
						/>
					)
				})
			) : (
				<GitStatusEmpty branch={data?.branch} />
			)}
		</List>
	)
}
