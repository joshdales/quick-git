import { List } from "@raycast/api"
import { BranchInfo } from "../utils/branch.js"
import { useMemo } from "react"

interface Props {
	repo?: string
	branch?: BranchInfo
}

export function GitStatusEmpty({ branch, repo }: Props) {
	const title = useMemo(() => {
		if (repo && branch) {
			let title = `On branch ${branch?.name}`
			if (branch.ahead || branch.behind) {
				title += `, ${branch.ahead} ${branch.behind} ${branch.upstream}`
			}

			return title
		}

		return "Please select a repo"
	}, [branch, repo])

	const description = useMemo(() => {
		if (!repo) {
			return
		}

		return `Nothing to commit, working tree clean`
	}, [repo])

	return <List.EmptyView title={title} description={description} />
}
