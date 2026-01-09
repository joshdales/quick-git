import { Action, Icon } from "@raycast/api";
import { useRepo, useRepoStorage } from "../../hooks/useRepo.js";
import { useCallback } from "react";
import { useCachedPromise } from "@raycast/utils";
import { findWorktreeDir } from "../../utils/worktrees.js";

interface Props {
  worktree: string;
}

export function SwitchToWorkTree({ worktree }: Props) {
  const repo = useRepo();
  const storage = useRepoStorage();
  const worktreeDir = useCachedPromise(() => findWorktreeDir(repo, worktree));

  const moveToWorktree = useCallback(() => {
    if (worktreeDir.data) {
      storage.setValue(worktreeDir.data);
    }
  }, [storage, worktreeDir.data]);

  return (
    <Action
      title="Switch to This Worktree"
      icon={Icon.Replace}
      onAction={moveToWorktree}
      shortcut={{ key: "-", modifiers: ["cmd"] }}
    />
  );
}
