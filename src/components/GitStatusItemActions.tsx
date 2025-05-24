import { Action, ActionPanel, Icon, Keyboard } from "@raycast/api"
import { useExec } from "@raycast/utils"
import { useCallback, useMemo } from "react"
import { GitCommit } from "./GitCommit.js"
import { GitPush } from "./GitPush.js"

interface Props {
	isNotStaged: boolean
	fileName: string
	repo: string
	checkStatus: () => void
}

export function GitStatusItemActions({
	isNotStaged,
	fileName,
	repo,
	checkStatus,
}: Props) {
	const { revalidate: stageAllFiles } = useExec("git", ["add", "."], {
		cwd: repo,
		execute: false,
		onData: checkStatus,
	})
	const { revalidate: stageItem } = useExec("git", ["add", fileName], {
		cwd: repo,
		execute: false,
		onData: checkStatus,
	})
	const { revalidate: unstageAllFiles } = useExec(
		"git",
		["restore", "--staged", "."],
		{
			cwd: repo,
			execute: false,
			onData: checkStatus,
		},
	)
	const { revalidate: unstageItem } = useExec(
		"git",
		["restore", "--staged", fileName],
		{
			cwd: repo,
			execute: false,
			onData: checkStatus,
		},
	)
	const { revalidate: restoreItem } = useExec("git", ["restore", fileName], {
		cwd: repo,
		execute: false,
		onData: checkStatus,
	})

	const mainAction = useCallback(() => {
		if (isNotStaged) {
			stageItem()
		} else {
			unstageItem()
		}
	}, [isNotStaged, stageItem, unstageItem])

	const filePath = useMemo(() => repo + "/" + fileName, [fileName, repo])

	return (
		<ActionPanel>
			<ActionPanel.Section>
				<Action
					icon={isNotStaged ? Icon.Plus : Icon.Minus}
					title={isNotStaged ? "Stage" : "Unstage"}
					onAction={mainAction}
				/>
				<Action.Push
					icon={Icon.Pencil}
					title="Commit"
					target={<GitCommit repo={repo} checkStatus={checkStatus} />}
				/>
				{isNotStaged && (
					<Action
						icon={Icon.Undo}
						title="Restore File"
						onAction={restoreItem}
					/>
				)}
			</ActionPanel.Section>
			<ActionPanel.Section title="Bulk Actions">
				<Action
					title="Stage All Files"
					onAction={stageAllFiles}
					shortcut={{ key: "a", modifiers: ["cmd", "shift"] }}
				/>
				<Action
					title="Unstage All Files"
					onAction={unstageAllFiles}
					shortcut={Keyboard.Shortcut.Common.RemoveAll}
				/>
			</ActionPanel.Section>
			<GitPush repo={repo} checkStatus={checkStatus} />
			<ActionPanel.Section title="File Utilities">
				<Action.CopyToClipboard
					title="Copy Filename"
					content={fileName}
					shortcut={Keyboard.Shortcut.Common.Copy}
				/>
				<Action.Open
					title="Open This File"
					target={filePath}
					shortcut={Keyboard.Shortcut.Common.Open}
				/>
			</ActionPanel.Section>
		</ActionPanel>
	)
}
