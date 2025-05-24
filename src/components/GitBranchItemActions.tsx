import { Action } from "@raycast/api"
import { useExec } from "@raycast/utils"
import { GitBranchActions } from "./GitBranchActions.js"

interface Props {
	branch: string
	repo: string
}

export function GitBranchItemActions({ repo, branch }: Props) {
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

	return (
		<>
			<Action title="Switch to This Branch" onAction={switchBranch} />
			<Action title="Delete This Branch" onAction={deleteBranch} />
			<GitBranchActions repo={repo} />
		</>
	)
}
