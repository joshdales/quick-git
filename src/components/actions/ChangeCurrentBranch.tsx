import { Action, Icon } from "@raycast/api";
import { GitBranch } from "../GitBranch/GitBranch.js";

interface Props {
  checkStatus: () => void;
}

export function ChangeCurrentBranch({ checkStatus }: Props) {
  return (
    <Action.Push
      title="Change Current Branch"
      icon={Icon.Switch}
      target={<GitBranch checkStatus={checkStatus} />}
      shortcut={{ key: "b", modifiers: ["cmd"] }}
    />
  );
}
