import { Action } from "@raycast/api"
import { useExec } from "@raycast/utils"
import { GitBranchActions } from "./GitBranchActions.js"

interface Props {
	branch: string
	repo: string
	isCurrentBranch: boolean
	checkBranches: () => void
	checkStatus: () => void
}

export function GitBranchItemActions({
	repo,
	branch,
	isCurrentBranch,
	checkBranches,
	checkStatus,
}: Props) {
	const { revalidate: switchBranch } = useExec("git", ["switch", branch], {
		cwd: repo,
		execute: false,
	})
	const { revalidate: deleteBranch } = useExec(
		"git",
		["branch", "-D", branch],
		{
			cwd: repo,
			execute: false,
		},
	)

	return isCurrentBranch ? (
		<GitBranchActions
			repo={repo}
			checkBranches={checkBranches}
			checkStatus={checkStatus}
		/>
	) : (
		<>
			<Action title="Switch to This Branch" onAction={switchBranch} />
			<Action title="Delete This Branch" onAction={deleteBranch} />
			<GitBranchActions
				repo={repo}
				checkBranches={checkBranches}
				checkStatus={checkStatus}
			/>
		</>
	)
}
