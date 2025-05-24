import { ActionPanel, List } from "@raycast/api"
import { useExec } from "@raycast/utils"
import { GitBranchItem } from "./GitBranchItem.js"
import { GitBranchActions } from "./GitBranchActions.js"

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
		<List
			isLoading={isLoading}
			navigationTitle="Switch Branch"
			actions={
				<ActionPanel>
					<GitBranchActions repo={repo} />
				</ActionPanel>
			}
		>
			{data?.map((branch) => (
				<GitBranchItem key={branch} branch={branch.trim()} repo={repo} />
			)) ?? <List.EmptyView title="There are no branches" />}
		</List>
	)
}
