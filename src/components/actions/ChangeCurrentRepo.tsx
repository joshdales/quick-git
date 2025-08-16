import { Action } from "@raycast/api";

interface Props {
  selectRepo: () => void;
}

export function SelectCurrentRepo({ selectRepo }: Props) {
  return <Action title="Update Repo" onAction={selectRepo} />;
}
