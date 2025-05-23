import { useExec, useLocalStorage } from "@raycast/utils"
import { GitStatusList } from "./components/GitStatusList.js"

export default function Command() {
	const { value: repo, isLoading: isLoadingRepo } =
		useLocalStorage<string>("repo")

	const { data, isLoading: isLoadingStatus } = useExec(
		"git",
		["status", "--porcelain"],
		{
			cwd: repo,
		},
	)

	if (!repo || !data) {
		return
	}

	return (
		<GitStatusList
			repo={repo}
			isLoading={isLoadingRepo || isLoadingStatus}
			statusData={data}
		/>
	)
}
