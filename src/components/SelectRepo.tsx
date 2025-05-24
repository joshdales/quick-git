import {
	Action,
	ActionPanel,
	Form,
	showToast,
	Toast,
	useNavigation,
} from "@raycast/api"
import { FormValidation, useForm, useLocalStorage } from "@raycast/utils"

interface Props {
	checkStatus: () => void
}

export default function SelectRepo({ checkStatus }: Props) {
	const { pop } = useNavigation()
	const { value, setValue, removeValue, isLoading } = useLocalStorage<
		string | undefined
	>("repo")
	const { handleSubmit } = useForm({
		onSubmit({ newRepo }: { newRepo: string }) {
			setValue(newRepo).then(() => {
				showToast({
					style: Toast.Style.Success,
					title: "Repo set!",
					message: `${newRepo}`,
				})
				checkStatus()
				pop()
			})
		},
		validation: {
			newRepo: FormValidation.Required,
		},
	})

	return (
		<Form
			isLoading={isLoading}
			actions={
				<ActionPanel>
					<Action.SubmitForm title="Set Repo" onSubmit={handleSubmit} />
					<Action.SubmitForm title="Unset Repo" onSubmit={removeValue} />
				</ActionPanel>
			}
		>
			<Form.TextField
				id="newRepo"
				title="Repo Directory"
				defaultValue={value}
				autoFocus
			/>
		</Form>
	)
}
