import { Action, Icon, showToast } from "@raycast/api"
import { showFailureToast, useExec } from "@raycast/utils"
import { useRepo } from "../../hooks/useRepo.js"

interface Props {
	fileName: string
	checkStatus: () => void
}

export function RestoreFile({ fileName, checkStatus }: Props) {
	const { value } = useRepo()
	const { revalidate } = useExec("git", ["restore", fileName], {
		cwd: value,
		execute: false,
		onData: () => {
			checkStatus()
			showToast({ title: `Restored ${fileName} to its previous state` })
		},
		onError: (error) => {
			showFailureToast(error, { title: `Could not restore ${fileName}` })
		},
	})

	return <Action icon={Icon.Undo} title="Restore File" onAction={revalidate} />
}
