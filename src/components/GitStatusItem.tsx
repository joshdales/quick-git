import { Icon, List } from "@raycast/api"
import { useMemo } from "react"
import { ItemActions } from "./ItemActions.js"

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

interface Props extends StatusItem {
	repo: string
	checkStatus: () => void
}

export function GitStatusItem({ fileName, gitX, repo, checkStatus }: Props) {
	const isNotStaged = useMemo(() => {
		return gitX === " " || gitX === "?"
	}, [gitX])

	return (
		<List.Item
			icon={isNotStaged ? Icon.Circle : Icon.CheckCircle}
			title={fileName}
			actions={
				<ItemActions
					isNotStaged={isNotStaged}
					repo={repo}
					fileName={fileName}
					checkStatus={checkStatus}
				/>
			}
		/>
	)
}
