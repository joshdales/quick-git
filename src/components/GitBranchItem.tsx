import { Icon, List } from "@raycast/api"
import { useMemo } from "react"

interface Props {
	branch: string
}

export function GitBranchItem({ branch }: Props) {
	const currentBranch = useMemo(() => branch.startsWith("*"), [branch])
	const title = useMemo(() => {
		if (currentBranch) {
			return branch.slice(2)
		}

		return branch
	}, [branch, currentBranch])

	const icon = useMemo(() => {
		if (currentBranch) {
			return { value: Icon.Dot, tooltip: "Current branch" }
		}
	}, [currentBranch])

	return <List.Item title={title} icon={icon} />
}
