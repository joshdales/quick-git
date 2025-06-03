import { Action, Icon } from "@raycast/api"
import { GitBranches } from "../GitBranches/GitBranches.js"

interface Props {
	checkStatus: () => void
}

export function SwitchBranch({ checkStatus }: Props) {
	return (
		<Action.Push
			icon={Icon.Switch}
			title="Switch Branch"
			shortcut={{ key: "b", modifiers: ["cmd"] }}
			target={<GitBranches checkStatus={checkStatus} />}
		/>
	)
}
