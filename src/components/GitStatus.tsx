import { Action, ActionPanel, List } from "@raycast/api"
import type { GitStatus } from "../utils/status.js"
import { parseGitStatus } from "../utils/status.js"
import { GitStatusItem } from "./GitStatusItem.js"
import SelectRepo from "./SelectRepo.js"
import { showFailureToast, useExec } from "@raycast/utils"
import { RemoteGitActions } from "./RemoteGitActions.js"
import { GitStatusEmpty } from "./GitStatusEmpty.js"

interface Props {
	repo?: string
	isLoading: boolean
}

export function GitStatus({ repo }: Props) {
	const { data, isLoading, revalidate } = useExec(
		"git",
		["status", "--porcelain=2", "--branch"],
		{
			cwd: repo,
			execute: !!repo,
			keepPreviousData: false,
			parseOutput: ({ stdout, error }) => {
				if (error) {
					showFailureToast(error, { title: "Could not fetch status" })
					return
				}

				if (!stdout) {
					return
				}
				return parseGitStatus(stdout)
			},
		},
	)

	return (
		<List
			isShowingDetail={!!repo && !!data?.files.length}
			isLoading={isLoading}
			actions={
				<ActionPanel>
					<Action.Push title="Set Repo" target={<SelectRepo />} />
					{repo ? (
						<RemoteGitActions repo={repo} checkStatus={revalidate} />
					) : null}
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
				<GitStatusEmpty repo={repo} branch={data?.branch} />
			)}
		</List>
	)
}
