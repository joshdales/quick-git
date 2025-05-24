import { Action, ActionPanel } from "@raycast/api"
import { useExec } from "@raycast/utils"

interface Props {
	repo: string
	checkStatus: () => void
}

export function GitPush({ repo, checkStatus }: Props) {
	const { revalidate } = useExec("git", ["push"], {
		cwd: repo,
		execute: false,
		onData: checkStatus,
	})
	return (
		<ActionPanel.Section>
			<Action title="Push" onAction={revalidate} />
		</ActionPanel.Section>
	)
}
