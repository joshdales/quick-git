import { Action } from "@raycast/api"
import { showFailureToast, useExec } from "@raycast/utils"
import CreateBranch from "./CreateBranch.js"

interface Props {
	repo: string
	checkBranches: () => void
	checkStatus: () => void
}

export function GitBranchActions({ repo, checkBranches, checkStatus }: Props) {
	const { revalidate: switchToLastBranch } = useExec("git", ["switch", "-"], {
		cwd: repo,
		execute: false,
		onData: () => {
			checkBranches()
			checkStatus()
		},
		onError: (error) => {
			showFailureToast(error, { title: "Could not switch branches" })
		},
	})

	return (
		<>
			<Action.Push
				title="Create a New Branch"
				target={
					<CreateBranch
						repo={repo}
						checkBranches={checkBranches}
						checkStatus={checkStatus}
					/>
				}
			/>
			<Action
				title="Switch to Your Last Branch"
				onAction={switchToLastBranch}
			/>
		</>
	)
}
