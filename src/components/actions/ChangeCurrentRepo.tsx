import { Action, Icon, launchCommand, LaunchType } from "@raycast/api"

interface Props {
	title?: string
}

export function ChangeCurrentRepo({ title = "Change Current Repo" }: Props) {
	return (
		<Action
			icon={Icon.Folder}
			title={title}
			onAction={() =>
				launchCommand({
					name: "set-repo",
					type: LaunchType.UserInitiated,
				})
			}
		/>
	)
}
