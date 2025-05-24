import { Action, ActionPanel, List } from "@raycast/api"
import type { GitStatus } from "../utils/status.js"
import { parseGitStatus } from "../utils/status.js"
import { GitStatusItem } from "./GitStatusItem.js"
import SelectRepo from "./SelectRepo.js"
import { showFailureToast, useExec } from "@raycast/utils"

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
				</ActionPanel>
			}
		>
			{repo && data?.files.length ? (
				data.files.map((item) => {
					return (
						<GitStatusItem
							repo={repo}
							key={item.fileName}
							fileName={item.fileName}
							staged={item.staged}
							unstaged={item.unstaged}
							branch={data.branch}
							checkStatus={revalidate}
						/>
					)
				})
			) : (
				<List.EmptyView
					title={
						!repo ? "Please select a repo" : `On branch ${data?.branch.name}`
					}
					description={
						repo ? "Nothing to commit, working tree clean" : undefined
					}
				/>
			)}
		</List>
	)
}
