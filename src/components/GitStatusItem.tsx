import { Icon, List } from "@raycast/api"
import { useMemo } from "react"
import { GitStatusItemActions } from "./GitStatusItemActions.js"
import type { StatusItem } from "../utils/status.js"
import { BranchInfo } from "../utils/branch.js"

interface Props extends Omit<StatusItem, "format"> {
	repo: string
	branch: BranchInfo
	checkStatus: () => void
}

export function GitStatusItem({
	fileName,
	staged,
	repo,
	origPath,
	checkStatus,
}: Props) {
	const isNotStaged = useMemo(() => {
		return staged === "." || staged === "?"
	}, [staged])

	const title = useMemo(() => {
		if (origPath) {
			return `${origPath} -> ${fileName}`
		}
		return fileName
	}, [fileName, origPath])

	return (
		<List.Item
			icon={isNotStaged ? Icon.Circle : Icon.CheckCircle}
			title={title}
			actions={
				<GitStatusItemActions
					isNotStaged={isNotStaged}
					repo={repo}
					fileName={fileName}
					checkStatus={checkStatus}
				/>
			}
			detail={<List.Item.Detail />}
		/>
	)
}
