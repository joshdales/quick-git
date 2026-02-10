import { Action, Icon, useNavigation } from "@raycast/api";
import { useCallback } from "react";
import { useCachedPromise } from "@raycast/utils";
import { findWorktreeDir } from "../../utils/worktrees.js";
import { useRepo } from "../../hooks/useRepo.js";

interface Props {
  worktree: string;
  updateRepo: (newRepo: string) => Promise<void>;
}

export function SwitchToWorkTree({ worktree, updateRepo }: Props) {
  const repo = useRepo();
  const worktreeDir = useCachedPromise(findWorktreeDir, [repo ?? "", worktree], {
    execute: !!repo,
  });
  const { pop } = useNavigation();

  const switchToWorktree = useCallback(() => {
    if (worktreeDir.data) {
      updateRepo(worktreeDir.data).then(pop);
    }
  }, [pop, updateRepo, worktreeDir.data]);

  return <Action title="Switch to This Worktree" icon={Icon.Replace} onAction={switchToWorktree} />;
}
