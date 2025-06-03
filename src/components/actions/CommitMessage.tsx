import { Action, Icon } from "@raycast/api"
import { GitCommit } from "../GitCommit.js"

interface Props {
	checkStatus: () => void
}
export function CommitMessage({ checkStatus }: Props) {
	return (
		<Action.Push
			icon={Icon.Pencil}
			title="Commit Message"
			target={<GitCommit checkStatus={checkStatus} />}
		/>
	)
}
