import { ActionPanel } from "@raycast/api"
import { RemoteGitActions } from "./RemoteGitActions.js"
import { BulkGitActions } from "./BulkGitActions.js"
import { OpenFile } from "../actions/OpenFile.js"
import { CopyFilename } from "../actions/CopyFilename.js"
import { ChangeCurrentRepo } from "../actions/ChangeCurrentRepo.js"
import { SwitchBranch } from "../actions/SwitchBranch.js"
import { AddFile } from "../actions/AddFile.js"
import { RestoreStagedFile } from "../actions/RestoreStagedFile.js"
import { CommitMessage } from "../actions/CommitMessage.js"
import { RestoreFile } from "../actions/RestoreFile.js"
import { FileDiff } from "../actions/FileDiff.js"

interface Props {
	isNotStaged: boolean
	fileName: string
	repo: string
	checkStatus: () => void
	updateDiff: (data: string) => void
}

export function GitStatusItemActions({
	isNotStaged,
	fileName,
	checkStatus,
	updateDiff,
}: Props) {
	return (
		<ActionPanel>
			<ActionPanel.Section>
				{isNotStaged ? (
					<AddFile fileName={fileName} checkStatus={checkStatus} />
				) : (
					<RestoreStagedFile fileName={fileName} checkStatus={checkStatus} />
				)}

				<CommitMessage checkStatus={checkStatus} />

				{isNotStaged ? (
					<RestoreFile checkStatus={checkStatus} fileName={fileName} />
				) : null}

				<FileDiff fileName={fileName} updateDiff={updateDiff} />
			</ActionPanel.Section>

			<SwitchBranch checkStatus={checkStatus} />

			<BulkGitActions checkStatus={checkStatus} />

			<RemoteGitActions checkStatus={checkStatus} />

			<ActionPanel.Section title="Utilities">
				<ChangeCurrentRepo />
				<CopyFilename fileName={fileName} />
				<OpenFile fileName={fileName} />
			</ActionPanel.Section>
		</ActionPanel>
	)
}
