import { Action, Icon } from "@raycast/api";
import { CreateWorktree } from "../forms/CreateWorktree.js";

interface Props {
  checkBranches: () => void;
}

export function CreateNewWorkTree({ checkBranches }: Props) {
  return (
    <Action.Push
      title="Create a New WorkTree"
      icon={Icon.Tree}
      shortcut={{
        macOS: { modifiers: ["cmd", "shift"], key: "n" },
        Windows: { modifiers: ["ctrl", "shift"], key: "n" },
      }}
      target={<CreateWorktree checkBranches={checkBranches} />}
    />
  );
}
