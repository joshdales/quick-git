import { CreateNewBranch } from "../actions/CreateNewBranch.js"
import { SwitchToLastBranch } from "../actions/SwitchToLastBranch.js"

interface Props {
	checkBranches: () => void
}

export function GitBranchActions({ checkBranches }: Props) {
	return (
		<>
			<CreateNewBranch checkBranches={checkBranches} />
			<SwitchToLastBranch checkBranches={checkBranches} />
		</>
	)
}
