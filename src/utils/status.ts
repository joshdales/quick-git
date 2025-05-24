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

export function parseGitStatus(dataRow: string): StatusItem {
	const gitX = dataRow.charAt(0) as GitStatus
	const gitY = dataRow.charAt(1) as GitStatus

	const fileName = dataRow.slice(3)
	return { fileName, gitX, gitY }
}
