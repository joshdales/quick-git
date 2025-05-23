import { Action, ActionPanel } from "@raycast/api"
import { useExec } from "@raycast/utils"
import { useCallback } from "react"

interface Props {
	isNotStaged: boolean
	fileName: string
	repo: string
	checkStatus: () => void
}

export function ItemActions({
	isNotStaged,
	fileName,
	repo,
	checkStatus,
}: Props) {
	const { revalidate: stageItem } = useExec("git", ["add", fileName], {
		cwd: repo,
		execute: false,
		onData: checkStatus,
	})
	const { revalidate: unstageItem } = useExec(
		"git",
		["restore", "--staged", fileName],
		{
			cwd: repo,
			execute: false,
			onData: checkStatus,
		},
	)

	const mainAction = useCallback(() => {
		if (isNotStaged) {
			stageItem()
		} else {
			unstageItem()
		}
	}, [isNotStaged, stageItem, unstageItem])

	return (
		<ActionPanel>
			<Action title={isNotStaged ? "Stage" : "Unstage"} onAction={mainAction} />
		</ActionPanel>
	)
}
