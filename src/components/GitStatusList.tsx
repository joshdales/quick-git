import { Icon, List } from "@raycast/api"
import { useMemo } from "react"

export type GitStatus =
	| /** unmodified */
	" "
	/** modified */
	| "M"
	/** file type changed (regular file, symbolic link or submodule) */
	| "T"
	/** added */
	| "A"
	/** deleted */
	| "D"
	/** renamed */
	| "R"
	/** copied (if config option status.renames is set to "copies") */
	| "C"
	/** updated but unmerged */
	| "U"
	/** untracked */
	| "?"
	/** ignored */
	| "!"

export interface StatusItem {
	/** Path of the file */
	fileName: string
	/** Status of the index */
	gitX: GitStatus
	/** Status of the working tree */
	gitY: GitStatus
}

function parseGitStatus(dataRow: string): StatusItem {
	const gitX = dataRow.charAt(0) as GitStatus
	const gitY = dataRow.charAt(1) as GitStatus

	const fileName = dataRow.slice(2)
	return { fileName, gitX, gitY }
}

export function GitStatusList({
	repo,
	statusData,
	isLoading,
}: {
	repo: string
	statusData?: string
	isLoading: boolean
}) {
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

function GitStatusItem({ fileName, gitY }: StatusItem) {
	return (
		<List.Item
			icon={gitY === " " || gitY !== "?" ? Icon.Circle : Icon.Checkmark}
			title={fileName}
		/>
	)
}
