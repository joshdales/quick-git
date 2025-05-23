import { useState } from "react"
import { Action, ActionPanel, Form, useNavigation } from "@raycast/api"
import { FormValidation, useExec, useForm } from "@raycast/utils"

interface Props {
	repo: string
}

export const GitCommit = ({ repo }: Props) => {
	const { pop } = useNavigation()
	const [commitMsg, setCommitMsg] = useState("")
	const { revalidate: commit } = useExec("git", ["commit", "-m", commitMsg], {
		cwd: repo,
		execute: false,
		onData: pop,
	})
	const { handleSubmit } = useForm({
		onSubmit() {
			commit()
		},
		validation: {
			commitMsg: FormValidation.Required,
		},
	})

	return (
		<Form
			actions={
				<ActionPanel>
					<Action.SubmitForm title="Commit" onSubmit={handleSubmit} />
				</ActionPanel>
			}
		>
			<Form.TextArea
				id="commitMsg"
				title="Commit message"
				value={commitMsg}
				onChange={setCommitMsg}
			/>
		</Form>
	)
}
