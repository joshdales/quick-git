import { ActionPanel } from "@raycast/api"
import { AddAllFiles } from "../actions/AddAllFiles.js"
import { StashAllFiles } from "../actions/StashAllFiles.js"
import { UnstageAllFiles } from "../actions/UnstageAllFiles.js"

interface Props {
	checkStatus: () => void
}

export function BulkGitActions({ checkStatus }: Props) {
	return (
		<ActionPanel.Section title="Bulk Actions">
			<AddAllFiles checkStatus={checkStatus} />
			<UnstageAllFiles checkStatus={checkStatus} />
			<StashAllFiles checkStatus={checkStatus} />
		</ActionPanel.Section>
	)
}
