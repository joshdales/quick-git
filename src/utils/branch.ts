export interface BranchInfo {
	commit: string
	name: string
	upstream?: string
	ahead?: string
	behind?: string
}

export function parseBranchHeaders(gitStatus: string, branchInfo: BranchInfo) {
	if (!gitStatus.startsWith("# branch")) {
		return
	}

	const fields = gitStatus.split(" ")
	switch (fields[1]) {
		case "branch.oid":
			branchInfo.commit = fields[2]
			break
		case "branch.head":
			branchInfo.name = fields[2]
			break
		case "branch.upstream":
			branchInfo.upstream = fields[2]
			break
		case "branch.ab": {
			const ahead = fields.find((field) => field.startsWith("+"))
			const behind = fields.find((field) => field.startsWith("-"))
			branchInfo.ahead = ahead
			branchInfo.behind = behind
			break
		}
		default:
			break
	}
}
