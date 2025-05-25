import { Action, ActionPanel, Icon, Keyboard, showToast } from "@raycast/api"
import { showFailureToast, useExec } from "@raycast/utils"

interface Props {
	repo: string
	checkStatus: () => void
}

export function RemoteGitActions({ repo, checkStatus }: Props) {
	const { revalidate: push } = useExec("git", ["push"], {
		cwd: repo,
		execute: false,
		onData: checkStatus,
		onError: (error) => {
			showFailureToast(error, { title: "Could not push this branch" })
		},
		onWillExecute: () => {
			showToast({ title: "Pushing branch" })
		},
	})
	const { revalidate: pull } = useExec("git", ["pull"], {
		cwd: repo,
		execute: false,
		onData: checkStatus,
		onError: (error) => {
			showFailureToast(error, { title: "Could not pull this branch" })
		},
		onWillExecute: () => {
			showToast({ title: "Pulling branch" })
		},
	})
	const { revalidate: fetch } = useExec("git", ["fetch"], {
		cwd: repo,
		execute: false,
		onData: checkStatus,
		onError: (error) => {
			showFailureToast(error, { title: "Could not fetch git data" })
		},
		onWillExecute: () => {
			showToast({ title: "Fetching repo data" })
		},
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
			<Action title="Fetch" onAction={fetch} />
		</ActionPanel.Section>
	)
}
