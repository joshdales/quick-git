import { Action, ActionPanel, List } from "@raycast/api"
import { useMemo } from "react"
import type { StatusItem, GitStatus } from "../utils/status.js"
import { parseGitStatus } from "../utils/status.js"
import { GitStatusItem } from "./GitStatusItem.js"
import SelectRepo from "./SelectRepo.js"

interface Props {
	repo?: string
	statusData?: string
	isLoading: boolean
	checkStatus: () => void
}

export function GitStatus({ statusData, isLoading, repo, checkStatus }: Props) {
	const statusItems = useMemo(() => {
		if (!statusData) {
			return []
		}

		return statusData.split("\n").map<StatusItem>(parseGitStatus)
	}, [statusData])

	return (
		<List
			isLoading={isLoading}
			actions={
				<ActionPanel>
					<Action.Push title="Set Repo" target={<SelectRepo />} />
				</ActionPanel>
			}
		>
			{repo && statusItems.length ? (
				statusItems.map((item) => {
					return (
						<GitStatusItem
							repo={repo}
							key={item.fileName}
							fileName={item.fileName}
							gitX={item.gitX}
							gitY={item.gitY}
							checkStatus={checkStatus}
						/>
					)
				})
			) : (
				<List.EmptyView title="Nothing to commit, working tree clean" />
			)}
		</List>
	)
}
