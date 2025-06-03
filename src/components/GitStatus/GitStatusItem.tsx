import { Icon, List } from "@raycast/api"
import { useMemo, useState } from "react"
import { GitStatusItemActions } from "./GitStatusItemActions.js"
import type { StatusInfo } from "../../utils/status.js"
import { BranchInfo } from "../../utils/branch.js"
import { GitStatusItemDetail } from "./GitStatusItemDetail.js"

interface Props {
	repo: string
	branch: BranchInfo
	status: StatusInfo
	checkStatus: () => void
}

export function GitStatusItem({ repo, status, branch, checkStatus }: Props) {
	const [diff, setDiff] = useState("")
	const isNotStaged = useMemo(() => {
		return status.staged === "." || status.staged === "?"
	}, [status.staged])

	const title = useMemo(() => {
		if (status.origPath) {
			return `${status.origPath} -> ${status.fileName}`
		}
		return status.fileName
	}, [status.fileName, status.origPath])

	const showDiff = useMemo(() => {
		if (status.unstaged === "?" || status.unstaged === "D") {
			return false
		}

		return true
	}, [status.unstaged])

	return (
		<List.Item
			icon={isNotStaged ? Icon.Circle : Icon.CheckCircle}
			title={title}
			actions={
				<GitStatusItemActions
					isNotStaged={isNotStaged}
					showDiffAction={showDiff}
					repo={repo}
					fileName={status.fileName}
					checkStatus={checkStatus}
					updateDiff={setDiff}
				/>
			}
			detail={
				<GitStatusItemDetail branch={branch} status={status} diff={diff} />
			}
		/>
	)
}
