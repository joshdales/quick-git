import { Action } from "@raycast/api"
import { useExec } from "@raycast/utils"

interface Props {
	branch: string
	matchingBranch: boolean
	repo: string
}

export function GitSwitchActions({ repo, branch, matchingBranch }: Props) {
	const { revalidate: switchBranch } = useExec("git", ["switch", branch], {
		cwd: repo,
		execute: false,
	})
	const { revalidate: createBranch } = useExec(
		"git",
		["switch", "-c", branch],
		{
			cwd: repo,
			execute: false,
		},
	)

	return matchingBranch ? (
		<>
			<Action title="Switch to Branch" onAction={switchBranch} />
			<Action title="Create Branch" onAction={createBranch} />
		</>
	) : (
		<Action title="Create Branch" onAction={createBranch} />
	)
}
