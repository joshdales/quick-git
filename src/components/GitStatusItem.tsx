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

export function GitStatusItem({ fileName, gitX }: StatusItem) {
	const icon = useMemo(() => {
		if (gitX === " ") {
			return Icon.Circle
		}

		if (gitX === "?") {
			return Icon.Circle
		}

		return Icon.Checkmark
	}, [gitX])

	return <List.Item icon={icon} title={fileName} />
}
