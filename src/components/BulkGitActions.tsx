import { Action, ActionPanel, Keyboard } from "@raycast/api"
import { useExec } from "@raycast/utils"

interface Props {
	repo: string
	checkStatus: () => void
}

export function BulkGitActions({ repo, checkStatus }: Props) {
	const { revalidate: stageAllFiles } = useExec("git", ["add", "."], {
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
	const { revalidate: stashFiles } = useExec("git", ["stash", "."], {
		cwd: repo,
		execute: false,
		onData: checkStatus,
	})

	return (
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
			<Action title="Stash Files" onAction={stashFiles} />
		</ActionPanel.Section>
	)
}
