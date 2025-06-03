import { ActionPanel } from "@raycast/api"
import { StageAllFiles } from "../actions/StageAllFiles.js"
import { StashAllFiles } from "../actions/StashAllFiles.js"
import { UnstageAllFiles } from "../actions/UnstageAllFiles.js"

interface Props {
	checkStatus: () => void
}

export function BulkGitActions({ checkStatus }: Props) {
	return (
		<ActionPanel.Section title="Bulk Actions">
			<StageAllFiles checkStatus={checkStatus} />
			<UnstageAllFiles checkStatus={checkStatus} />
			<StashAllFiles checkStatus={checkStatus} />
		</ActionPanel.Section>
	)
}
