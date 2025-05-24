import { Action, ActionPanel, Icon } from "@raycast/api"
import { useExec } from "@raycast/utils"

interface Props {
	repo: string
	checkStatus: () => void
}

export function GitPush({ repo, checkStatus }: Props) {
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
			<Action title="Push" onAction={push} icon={Icon.AirplaneTakeoff} />
			<Action title="Pull" onAction={pull} icon={Icon.AirplaneLanding} />
		</ActionPanel.Section>
	)
}
