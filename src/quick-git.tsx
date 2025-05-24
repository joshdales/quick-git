import { useExec, useLocalStorage } from "@raycast/utils"
import { GitStatus } from "./components/GitStatus.js"
import { useEffect } from "react"

export default function Command() {
	const { value: repo, isLoading: isLoadingRepo } =
		useLocalStorage<string>("repo")

	const {
		data,
		isLoading: isLoadingStatus,
		revalidate,
	} = useExec("git", ["status", "--porcelain=2"], {
		cwd: repo,
		execute: false,
	})

	useEffect(() => {
		if (repo) {
			revalidate()
		}
	}, [repo, revalidate])

	return (
		<GitStatus
			repo={repo}
			isLoading={data === undefined || isLoadingRepo || isLoadingStatus}
			statusData={data}
			checkStatus={revalidate}
		/>
	)
}
