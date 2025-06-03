import { GitBranchActions } from "./GitBranchActions.js"
import { SwitchToBranch } from "../actions/SwitchToBranch.js"
import { DeleteBranch } from "../actions/DeleteBranch.js"

interface Props {
	branch: string
	isCurrentBranch: boolean
	checkBranches: () => void
}

export function GitBranchItemActions({
	branch,
	isCurrentBranch,
	checkBranches,
}: Props) {
	return (
		<>
			{!isCurrentBranch ? (
				<>
					<SwitchToBranch branch={branch} checkBranches={checkBranches} />
					<DeleteBranch branch={branch} checkBranches={checkBranches} />
				</>
			) : null}
			<GitBranchActions checkBranches={checkBranches} />
		</>
	)
}
