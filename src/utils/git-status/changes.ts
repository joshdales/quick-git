/**
 * Letter code that indicates the type of changes.
 * - `.` Unmodified
 * - `M` Modified
 * - `T` File type changed (regular file, symbolic link or submodule)
 * - `A` Added
 * - `D` Deleted
 * - `R` Renamed
 * - `C` Copied (if config option status.renames is set to "copies")
 * - `U` Updated but unmerged
 * - `?` Untracked
 * - `!` Ignored
 */
export type StatusValue = "." | "M" | "T" | "A" | "D" | "R" | "C" | "U" | "?" | "!";

/**
 * Split the indicated changes into a tuple
 * @param xy Two character field indicating staged and unstaged changes
 * @returns The changes that are staged, and the working changed
 */
export function parseChanges(xy: string): [StatusValue, StatusValue] {
  return [xy.charAt(0) as StatusValue, xy.charAt(1) as StatusValue];
}
