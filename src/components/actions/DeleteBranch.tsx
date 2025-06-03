import { Action, Icon, showToast } from "@raycast/api"
import { showFailureToast, useExec } from "@raycast/utils"
import { useRepo } from "../../hooks/useRepo.js"

interface Props {
	branch: string
	checkBranches: () => void
}

export function DeleteBranch({ branch, checkBranches }: Props) {
	const { value: repo } = useRepo()
	const { revalidate: hardDeleteBranch } = useExec(
		"git",
		["branch", "-D", branch],
		{
			cwd: repo,
			execute: false,
			onData: () => {
				showToast({ title: `Deleted branch ${branch}` })
				checkBranches()
			},
			onError: (error) => {
				showFailureToast(error, { title: `Could not delete branch ${branch}` })
			},
		},
	)
	const { revalidate: deleteBranch } = useExec(
		"git",
		["branch", "-d", branch],
		{
			cwd: repo,
			execute: false,
			onData: () => {
				showToast({ title: `Deleted branch ${branch}` })
				checkBranches()
			},
			onError: (error) => {
				showFailureToast(error, {
					title: `Could not delete ${branch}`,
					primaryAction: {
						title: "Confirm delete?",
						onAction: hardDeleteBranch,
					},
				})
			},
		},
	)

	return (
		<Action
			icon={Icon.Trash}
			title="Delete This Branch"
			onAction={deleteBranch}
		/>
	)
}
