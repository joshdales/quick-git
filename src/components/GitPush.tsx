import { Action } from "@raycast/api"
import { useExec } from "@raycast/utils"

interface Props {
	repo: string
}

export function GitPush({ repo }: Props) {
	const { revalidate } = useExec("git", ["push"], { cwd: repo, execute: false })
	return <Action title="Push" onAction={revalidate} />
}
