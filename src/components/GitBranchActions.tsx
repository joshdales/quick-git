import { Action } from "@raycast/api"
import { useExec } from "@raycast/utils"
import CreateBranch from "./CreateBranch.js"

interface Props {
	repo: string
}

export function GitBranchActions({ repo }: Props) {
	const { revalidate: switchToLastBranch } = useExec("git", ["switch", "-"], {
		cwd: repo,
		execute: false,
	})

	return (
		<>
			<Action.Push
				title="Create a New Branch"
				target={<CreateBranch repo={repo} />}
			/>
			<Action
				title="Switch to Your Last Branch"
				onAction={switchToLastBranch}
			/>
		</>
	)
}
