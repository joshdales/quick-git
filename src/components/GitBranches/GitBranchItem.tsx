import { ActionPanel, List } from "@raycast/api"
import { useMemo } from "react"
import { GitBranchItemActions } from "./GitBranchItemActions.js"

interface Props {
	branch: string
	checkBranches: () => void
}

export function GitBranchItem({ branch, checkBranches }: Props) {
	// Git indicates the current branch by start that row with with a `*`
	const isCurrentBranch = useMemo(() => branch.startsWith("*"), [branch])

	const title = useMemo(() => {
		if (isCurrentBranch) {
			// Skip over the leading `*` and whitespace
			return branch.slice(2)
		}

		return branch
	}, [branch, isCurrentBranch])

	const accessories = useMemo(() => {
		if (isCurrentBranch) {
			return [{ text: "Current branch" }]
		}
	}, [isCurrentBranch])

	return (
		<List.Item
			title={title}
			accessories={accessories}
			actions={
				<ActionPanel>
					<GitBranchItemActions
						branch={title}
						isCurrentBranch={isCurrentBranch}
						checkBranches={checkBranches}
					/>
				</ActionPanel>
			}
		/>
	)
}
