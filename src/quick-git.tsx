import { useExec, useLocalStorage } from "@raycast/utils"
import { GitStatusList } from "./components/GitStatusList.js"
import { useEffect } from "react"

export default function Command() {
	const { value: repo, isLoading: isLoadingRepo } =
		useLocalStorage<string>("repo")

	const {
		data,
		isLoading: isLoadingStatus,
		revalidate,
	} = useExec("git", ["status", "--porcelain"], {
		cwd: repo,
		execute: false,
	})

	useEffect(() => {
		if (repo) {
			revalidate()
		}
	}, [repo, revalidate])

	return (
		<GitStatusList
			repo={repo}
			isLoading={data === undefined || isLoadingRepo || isLoadingStatus}
			statusData={data}
		/>
	)
}
