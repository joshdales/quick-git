import { Action, ActionPanel, Icon, Keyboard } from "@raycast/api"
import { useExec } from "@raycast/utils"

interface Props {
	repo: string
	checkStatus: () => void
}

export function RemoteGitActions({ repo, checkStatus }: Props) {
	const { revalidate: push } = useExec("git", ["push"], {
		cwd: repo,
		execute: false,
		onData: checkStatus,
	})
	const { revalidate: pull } = useExec("git", ["pull"], {
		cwd: repo,
		execute: false,
		onData: checkStatus,
	})

	return (
		<ActionPanel.Section title="Remote">
			<Action
				title="Push"
				onAction={push}
				icon={Icon.Upload}
				shortcut={Keyboard.Shortcut.Common.MoveUp}
			/>
			<Action
				title="Pull"
				onAction={pull}
				icon={Icon.Download}
				shortcut={Keyboard.Shortcut.Common.MoveDown}
			/>
		</ActionPanel.Section>
	)
}
