import { FileStatus } from "./file.js";

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

export interface ChangeStatus {
  unstagedChanges: boolean;
  unstagedChangesType?: StatusValueName;
  stagedChanges: boolean;
  stagedChangesType?: StatusValueName;
  changeScore?: number;
  unmergedChanges: boolean;
}

export function parseChanges(fileStatus: FileStatus): ChangeStatus {
  if (fileStatus.indicator === "!" || fileStatus.indicator === "?") {
    return {
      stagedChanges: false,
      unstagedChanges: true,
      unstagedChangesType: parseStatusValue(fileStatus.indicator),
      unmergedChanges: false,
    };
  }

  const [index, workingTree] = splitChanges(fileStatus.xy);
  const status: ChangeStatus = {
    unstagedChanges: /[^.?!]/.test(workingTree),
    stagedChanges: /[^.]/.test(index),
    unmergedChanges:
      index === "U" ||
      workingTree === "U" ||
      (index === "A" && workingTree === "A") ||
      (index === "D" && workingTree === "D"),
  };
  if (status.stagedChanges) {
    status.stagedChangesType = parseStatusValue(index);
  }
  if (status.unstagedChanges) {
    status.unstagedChangesType = parseStatusValue(workingTree);
  }

  if (fileStatus.indicator === "2") {
    status.changeScore = fileStatus.rcScore;
  }

  return status;
}

/**
 * Split the indicated changes into a tuple
 * @param xy Two character field indicating staged and unstaged changes
 * @returns The changes that are staged, and the working changed
 */
export function splitChanges(xy: string): [StatusValue, StatusValue] {
  return [xy.charAt(0) as StatusValue, xy.charAt(1) as StatusValue];
}

type StatusValueName = ReturnType<typeof parseStatusValue>;

function parseStatusValue(status: StatusValue) {
  switch (status) {
    case "M":
      return "Modified";
    case "T":
      return "Type changed";
    case "A":
      return "Added";
    case "D":
      return "Deleted";
    case "R":
      return "Renamed";
    case "C":
      return "Copied";
    case "U":
      return "Unmerged";
    case "?":
      return "Untracked";
    case "!":
      return "Ignored";
  }
}
