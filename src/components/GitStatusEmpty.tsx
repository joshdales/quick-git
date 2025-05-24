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
			const title = `On branch ${branch?.name}`
			const { ahead, behind, upstream } = branch
			if (upstream && (ahead || behind)) {
				if (ahead && behind) {
					return (
						title +
						`. Ahead of '${upstream}' by ${ahead}, and behind by ${behind} commits`
					)
				}

				if (ahead && !behind) {
					return title + `, ahead of '${upstream}' by ${ahead} commits.`
				}

				if (!ahead && behind) {
					return title + `, behind '${upstream}' by ${behind} commits.`
				}
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
