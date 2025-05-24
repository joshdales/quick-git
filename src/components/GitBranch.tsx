import { ActionPanel, List } from "@raycast/api"
import { useExec } from "@raycast/utils"
import { GitBranchItem } from "./GitBranchItem.js"
import { GitSwitchActions } from "./GitSwitchAction.js"
import { useState } from "react"

interface Props {
	repo: string
}

export function GitBranch({ repo }: Props) {
	const [searchQuery, setSearchQuery] = useState<string>("")
	const [selectedBranch, setSelectedBranch] = useState<string | null>(null)
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
			onSearchTextChange={setSearchQuery}
			onSelectionChange={setSelectedBranch}
			actions={
				<ActionPanel>
					<GitSwitchActions
						repo={repo}
						matchingBranch={!!selectedBranch}
						branch={selectedBranch ?? searchQuery}
					/>
				</ActionPanel>
			}
		>
			{data ? (
				data.map((branch) => <GitBranchItem key={branch} branch={branch} />)
			) : (
				<List.EmptyView title="No branches" />
			)}
		</List>
	)
}
