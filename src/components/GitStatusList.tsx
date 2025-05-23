import { List } from "@raycast/api"
import { useMemo } from "react"
import type { StatusItem, GitStatus } from "./GitStatusItem.js"
import { GitStatusItem } from "./GitStatusItem.js"

function parseGitStatus(dataRow: string): StatusItem {
	const gitX = dataRow.charAt(0) as GitStatus
	const gitY = dataRow.charAt(1) as GitStatus

	const fileName = dataRow.slice(3)
	return { fileName, gitX, gitY }
}

interface Props {
	repo?: string
	statusData?: string
	isLoading: boolean
	checkStatus: () => void
}

export function GitStatusList({
	statusData,
	isLoading,
	repo,
	checkStatus,
}: Props) {
	const statusItems = useMemo(() => {
		if (!statusData) {
			return []
		}

		return statusData.split("\n").map<StatusItem>(parseGitStatus)
	}, [statusData])

	return (
		<List isLoading={isLoading}>
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
