import { Action, ActionPanel, Form, useNavigation } from "@raycast/api"
import { FormValidation, useExec, useForm } from "@raycast/utils"
import { useState } from "react"

interface Props {
	repo: string
	checkBranches: () => void
	checkStatus: () => void
}

export default function CreateBranch({
	repo,
	checkBranches,
	checkStatus,
}: Props) {
	const [branchName, setBranchName] = useState("")
	const { revalidate, isLoading } = useExec(
		"git",
		["switch", "-c", branchName],
		{
			cwd: repo,
			execute: false,
			onData: () => {
				checkBranches()
				checkStatus()
				pop()
			},
		},
	)
	const { pop } = useNavigation()
	const { handleSubmit, itemProps } = useForm({
		onSubmit: revalidate,
		validation: {
			newBranch: FormValidation.Required,
		},
	})

	return (
		<Form
			isLoading={isLoading}
			actions={
				<ActionPanel>
					<Action.SubmitForm title="Create Branch" onSubmit={handleSubmit} />
				</ActionPanel>
			}
		>
			<Form.TextField
				id="newBranch"
				title="Branch Name"
				value={branchName}
				onChange={setBranchName}
				autoFocus
				error={itemProps.newBranch.error}
			/>
		</Form>
	)
}
