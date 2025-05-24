import { Icon, List } from "@raycast/api"
import { useMemo } from "react"
import { ItemActions } from "./ItemActions.js"
import type { StatusItem } from "../utils/status.js"

interface Props extends StatusItem {
	repo: string
	checkStatus: () => void
}

export function GitStatusItem({ fileName, gitX, repo, checkStatus }: Props) {
	const isNotStaged = useMemo(() => {
		return gitX === " " || gitX === "?"
	}, [gitX])

	return (
		<List.Item
			icon={isNotStaged ? Icon.Circle : Icon.CheckCircle}
			title={fileName}
			actions={
				<ItemActions
					isNotStaged={isNotStaged}
					repo={repo}
					fileName={fileName}
					checkStatus={checkStatus}
				/>
			}
		/>
	)
}
