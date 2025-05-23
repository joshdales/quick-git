import { Action, ActionPanel } from "@raycast/api"
import { useExec } from "@raycast/utils"
import { useCallback } from "react"

interface Props {
	isNotStaged: boolean
	fileName: string
	repo: string
}

export function ItemActions({ isNotStaged, fileName, repo }: Props) {
	const { revalidate: stageItem } = useExec("git", ["add", fileName], {
		cwd: repo,
		execute: false,
	})
	const { revalidate: unstageItem } = useExec(
		"git",
		["restore", "--staged", fileName],
		{
			cwd: repo,
			execute: false,
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
