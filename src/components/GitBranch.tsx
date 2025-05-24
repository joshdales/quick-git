import { List } from "@raycast/api"
import { useExec } from "@raycast/utils"

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
				data.map((branch) => <List.Item key={branch} title={branch} />)
			) : (
				<List.EmptyView title="No branches" />
			)}
		</List>
	)
}
