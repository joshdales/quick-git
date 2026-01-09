import { Action, Icon } from "@raycast/api";
import { useRepoStorage } from "../../hooks/useRepo.js";
import { useCallback } from "react";
import { useCachedPromise } from "@raycast/utils";
import { findWorktreeDir } from "../../utils/worktrees.js";

interface Props {
  worktree: string;
  checkBranches: () => void;
}

export function SwitchToWorkTree({ worktree, checkBranches }: Props) {
  const repo = useRepoStorage();
  const worktreeDir = useCachedPromise(findWorktreeDir, [repo.value ?? "", worktree], {
    execute: !!repo.value,
  });

  const switchToWorktree = useCallback(() => {
    if (worktreeDir.data) {
      repo.setValue(worktreeDir.data).then(checkBranches);
    }
  }, [checkBranches, repo, worktreeDir.data]);

  return (
    <Action
      title="Switch to This Worktree"
      icon={Icon.Replace}
      onAction={switchToWorktree}
      shortcut={{ key: "-", modifiers: ["cmd"] }}
    />
  );
}
