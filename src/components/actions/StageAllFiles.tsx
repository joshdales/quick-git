import { Action, showToast } from "@raycast/api"
import { showFailureToast, useExec } from "@raycast/utils"
import { useRepo } from "../../hooks/useRepo.js"

interface Props {
	checkStatus: () => void
}

export function StageAllFiles({ checkStatus }: Props) {
	const { value } = useRepo()
	const { revalidate } = useExec("git", ["add", "."], {
		cwd: value,
		execute: false,
		onData: () => {
			checkStatus()
			showToast({ title: "Added files" })
		},
		onError: (error) => {
			showFailureToast(error, { title: "Could not stage files" })
		},
	})

	return (
		<Action
			title="Stage All Files"
			onAction={revalidate}
			shortcut={{ key: "a", modifiers: ["cmd", "shift"] }}
		/>
	)
}
