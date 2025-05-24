import { List } from "@raycast/api"
import { BranchInfo } from "../utils/branch.js"
import { useMemo } from "react"

interface Props {
	repo?: string
	branch?: BranchInfo
}

export function GitStatusEmpty({ branch, repo }: Props) {
	const title = useMemo(() => {
		if (repo) {
			return `Nothing to commit on ${branch?.name}`
		}

		return "Please select a repo"
	}, [branch?.name, repo])

	const description = useMemo(() => {
		if (!repo) {
			return
		}

		return `Nothing to commit, working tree clean`
	}, [repo])

	return <List.EmptyView title={title} description={description} />
}
