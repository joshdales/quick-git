import { List } from "@raycast/api"
import { useMemo } from "react"
import type { StatusItem, GitStatus } from "./GitStatusItem.js"
import { GitStatusItem } from "./GitStatusItem.js"

function parseGitStatus(dataRow: string): StatusItem {
	const gitX = dataRow.charAt(0) as GitStatus
	const gitY = dataRow.charAt(1) as GitStatus

	const fileName = dataRow.slice(2)
	return { fileName, gitX, gitY }
}

interface Props {
	repo?: string
	statusData?: string
	isLoading: boolean
}

export function GitStatusList({ statusData, isLoading }: Props) {
	const statusItems = useMemo(
		() => statusData?.split("\n").map<StatusItem>(parseGitStatus) ?? [],
		[statusData],
	)

	return (
		<List isLoading={isLoading}>
			{statusItems.map((item) => {
				return (
					<GitStatusItem
						key={item.fileName}
						fileName={item.fileName}
						gitX={item.gitX}
						gitY={item.gitY}
					/>
				)
			})}
		</List>
	)
}
