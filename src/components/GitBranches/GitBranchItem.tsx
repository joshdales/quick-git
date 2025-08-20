import { useMemo } from "react";
import { List } from "@raycast/api";
import { GitBranchItemActions } from "./GitBranchItemActions.js";
import { BranchInfo } from "../../utils/git-branch/branch.js";

interface Props {
  branch: BranchInfo;
  checkBranches: () => void;
}

export function GitBranchItem({ branch, checkBranches }: Props) {
  const accessories = useMemo(() => {
    if (branch.isCurrentBranch) {
      return [{ text: "Current branch" }];
    }

    if (branch.isWorktree) {
      return [{ text: "Worktree" }];
    }
  }, [branch.isCurrentBranch, branch.isWorktree]);

  return (
    <List.Item
      title={branch.name}
      accessories={accessories}
      actions={
        <GitBranchItemActions
          branch={branch.name}
          isCurrentBranch={branch.isCurrentBranch}
          checkBranches={checkBranches}
        />
      }
    />
  );
}
