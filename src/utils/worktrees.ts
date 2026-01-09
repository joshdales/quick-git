import { join } from "node:path";
import { readFile } from "node:fs/promises";

/** Find the directory for a worktree in the main git repo */
export async function findWorktreeDir(repoRoot: string, worktree: string): Promise<string> {
  const path = join(repoRoot, ".git", "worktrees", worktree, "gitdir");
  let file: string;
  try {
    file = await readFile(path, "utf8");
  } catch {
    throw new Error(`Could not find directory worktree for ${path}`);
  }

  return file.trim();
}
