export interface BranchInfo {
  name: string;
  isWorktree: boolean;
  isCurrentBranch: boolean;
}

export function parseBranches(branchCmd: string): BranchInfo[] | undefined {
  if (!branchCmd) {
    return;
  }

  return branchCmd.split("\n").reduce<BranchInfo[]>((list, branch) => {
    if (!branch) {
      return list;
    }

    const parts = branch.trim().split(/\s/);
    let item: BranchInfo;
    if (parts.length > 1) {
      item = {
        name: parts[1].trim(),
        isCurrentBranch: parts[0].startsWith("*"),
        isWorktree: parts[0].startsWith("+"),
      };
    } else {
      item = {
        name: parts[0],
        isWorktree: false,
        isCurrentBranch: false,
      };
    }

    list.push(item);

    return list;
  }, []);
}
