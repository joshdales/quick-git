import { Action, Icon } from "@raycast/api";
import { GitSubmodules } from "../GitSubmodules.js";
import { useCheckStatus } from "../../hooks/useCheckStatus.js";

interface Props {
  repo: string;
  changeRepo: (repoDir: string) => Promise<void>;
}

export function ChangeSubmodules({ changeRepo, repo }: Props) {
  const checkStatus = useCheckStatus();

  return (
    <Action.Push
      title="View Submodules"
      icon={Icon.ArrowsExpand}
      target={<GitSubmodules repo={repo} changeRepo={changeRepo} checkStatus={checkStatus} />}
      shortcut={{
        macOS: { key: "s", modifiers: ["cmd", "shift"] },
        Windows: { key: "s", modifiers: ["ctrl", "shift"] },
      }}
    />
  );
}
