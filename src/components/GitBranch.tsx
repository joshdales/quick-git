import { List } from "@raycast/api"
import { useExec } from "@raycast/utils"
import { GitBranchItem } from "./GitBranchItem.js"

interface Props {
	repo: string
}

export function GitBranch({ repo }: Props) {
	const { data, isLoading } = useExec(
		"git",
		["branch", "--sort=-committerdate"],
		{
			cwd: repo,
			parseOutput: ({ stdout }) => {
				if (!stdout) {
					return
				}

				return stdout.split("\n")
			},
		},
	)

	return (
		<List isLoading={isLoading}>
			{data ? (
				data.map((branch) => <GitBranchItem key={branch} branch={branch} />)
			) : (
				<List.EmptyView title="No branches" />
			)}
		</List>
	)
}
