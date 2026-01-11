import { Action, Icon, useNavigation } from "@raycast/api";
import { useRepoStorage } from "../../hooks/useRepo.js";
import { useCallback } from "react";
import { useCachedPromise } from "@raycast/utils";
import { findWorktreeDir } from "../../utils/worktrees.js";

interface Props {
  worktree: string;
}

export function SwitchToWorkTree({ worktree }: Props) {
  const repo = useRepoStorage();
  const worktreeDir = useCachedPromise(findWorktreeDir, [repo.value ?? "", worktree], {
    execute: !!repo.value,
  });
  const { pop } = useNavigation();

  const switchToWorktree = useCallback(() => {
    if (worktreeDir.data) {
      repo.setValue(worktreeDir.data).then(pop);
    }
  }, [pop, repo, worktreeDir.data]);

  return <Action title="Switch to This Worktree" icon={Icon.Replace} onAction={switchToWorktree} />;
}
