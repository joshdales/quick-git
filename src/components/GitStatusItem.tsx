import { Icon, List } from "@raycast/api"
import { useMemo } from "react"
import { ItemActions } from "./ItemActions.js"
import type { StatusItem } from "../utils/status.js"

interface Props extends Omit<StatusItem, "format"> {
	repo: string
	checkStatus: () => void
}

export function GitStatusItem({
	fileName,
	staged: gitX,
	repo,
	checkStatus,
}: Props) {
	const isNotStaged = useMemo(() => {
		return gitX === "." || gitX === "?"
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
