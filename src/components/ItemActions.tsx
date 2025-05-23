import { Action, ActionPanel } from "@raycast/api"
import { useExec } from "@raycast/utils"
import { useCallback } from "react"

interface Props {
	isNotStaged: boolean
	fileName: string
	repo: string
}

export function ItemActions({ isNotStaged, fileName, repo }: Props) {
	const stageItem = useExec("git", ["add", fileName], {
		cwd: repo,
		execute: false,
	})
	const unstageItem = useExec("git", ["restore", "staged", fileName], {
		cwd: repo,
		execute: false,
	})

	const mainAction = useCallback(() => {
		if (isNotStaged) {
			stageItem.revalidate()
		} else {
			unstageItem.revalidate()
		}
	}, [isNotStaged, stageItem, unstageItem])

	return (
		<ActionPanel>
			<Action title={isNotStaged ? "Stage" : "Unstage"} onAction={mainAction} />
		</ActionPanel>
	)
}
