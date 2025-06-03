import { Action, Icon } from "@raycast/api"
import { useExec } from "@raycast/utils"
import { useRepo } from "../../hooks/useRepo.js"

interface Props {
	fileName: string
	updateDiff: (data: string) => void
}

export function FileDiff({ fileName, updateDiff }: Props) {
	const { value: repo } = useRepo()
	const { revalidate } = useExec(
		"git",
		["diff", "--histogram", "head", fileName],
		{
			cwd: repo,
			execute: false,
			onData: (data) => {
				updateDiff(data)
			},
		},
	)

	return (
		<Action
			icon={Icon.Paragraph}
			shortcut={{ key: "d", modifiers: ["cmd"] }}
			title="Show Diff"
			onAction={revalidate}
		/>
	)
}
