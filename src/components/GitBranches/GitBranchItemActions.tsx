import { ActionPanel } from "@raycast/api";
import { SwitchToBranch } from "../actions/SwitchToBranch.js";
import { DeleteBranch } from "../actions/DeleteBranch.js";
import { CreateNewBranch } from "../actions/CreateNewBranch.js";
import { SwitchToLastBranch } from "../actions/SwitchToLastBranch.js";
import { SwitchToWorkTree } from "../actions/SwitchToWorktree.js";
import { useMemo } from "react";

interface Props {
  branch: string;
  isCurrentBranch: boolean;
  isWorktree: boolean;
  checkBranches: () => void;
  updateRepo: (value: string) => Promise<void>;
}

export function GitBranchItemActions({ branch, isCurrentBranch, isWorktree, checkBranches, updateRepo }: Props) {
  const actions = useMemo(() => {
    if (isWorktree) {
      return <SwitchToWorkTree worktree={branch} updateRepo={updateRepo} />;
    }

    if (!isCurrentBranch) {
      return (
        <>
          <SwitchToBranch branch={branch} checkBranches={checkBranches} />
          <DeleteBranch branch={branch} checkBranches={checkBranches} />
        </>
      );
    }

    return null;
  }, [branch, checkBranches, isCurrentBranch, isWorktree]);

  return (
    <ActionPanel>
      {actions}
      <CreateNewBranch checkBranches={checkBranches} />
      <SwitchToLastBranch checkBranches={checkBranches} />
    </ActionPanel>
  );
}
