import { useLocalStorage } from "@raycast/utils"
import { GitStatus } from "./components/GitStatus.js"

export default function Command() {
	const { value: repo, isLoading } = useLocalStorage<string>("repo")

	return <GitStatus repo={repo} isLoading={isLoading} />
}
