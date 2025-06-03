import { Action, Icon, Keyboard } from "@raycast/api"
import CreateBranch from "../CreateBranch.js"

interface Props {
	checkBranches: () => void
}

export function CreateNewBranch({ checkBranches }: Props) {
	return (
		<Action.Push
			icon={Icon.Plus}
			title="Create a New Branch"
			shortcut={Keyboard.Shortcut.Common.New}
			target={<CreateBranch checkBranches={checkBranches} />}
		/>
	)
}
