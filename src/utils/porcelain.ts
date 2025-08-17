import { BranchInfo, parseBranchHeaders } from "./git-status/branch.js";
import { parseFileStatus } from "./git-status/file.js";
import { ChangeStatus, parseChanges, splitChanges, type StatusValue } from "./git-status/changes.js";
import { parseSubmodule, SubmoduleStatus } from "./git-status/submodule.js";

export type { StatusValue as GitStatus } from "./git-status/changes.js";
export type GitStatusFormat = "changed" | "renamed" | "unmerged" | "untracked" | "ignored";

export interface StatusInfo {
  /** @deprecated */
  format: GitStatusFormat;
  /** Path of the file */
  fileName: string;
  /** Original path of the file if it was renamed/copied */
  origPath?: string;
  /** @deprecated Status of the index */
  staged: StatusValue;
  /** @deprecated Status of the working tree */
  unstaged: StatusValue;
  /** Information about submodules */
  submodule: SubmoduleStatus;
  /** Information about the changes to this file */
  changes: ChangeStatus;
}

/**
 * Git Status Porcelain Format Version 2 have 3 lines indicated by the first character:
 * - `1`: A changed file
 * - `2`: A renamed file
 * - `u`: An unmerged file
 *
 * There are also two other options:
 * - `?` An untracked file
 * - `!` An ignored file
 */
function lineFormat(format: string): GitStatusFormat {
  switch (format) {
    case "1":
      return "changed";
    case "2":
      return "renamed";
    case "u":
      return "unmerged";
    case "?":
      return "untracked";
    default:
      return "ignored";
  }
}

/**
 * Parse a row from git status in the Porcelain 2 format
 * @param dataRow
 * @returns
 */
function parseGitFileStatus(dataRow: string): StatusInfo {
  const fields = parseFileStatus(dataRow);
  const changes = parseChanges(fields);
  if (fields.indicator === "?" || fields.indicator === "!") {
    return {
      format: "untracked",
      fileName: fields.path,
      staged: ".",
      unstaged: fields.indicator,
      submodule: { isSubmodule: false },
      changes,
    };
  }
  const format = lineFormat(fields.indicator);
  const [staged, unstaged] = splitChanges(fields.xy);
  const submodule = parseSubmodule(fields.submodule);

  return {
    format,
    fileName: fields.path,
    origPath: fields.indicator === "2" ? fields.origPath : undefined,
    staged,
    unstaged,
    submodule,
    changes,
  };
}

interface PorcelainStatus {
  branch: BranchInfo;
  files: StatusInfo[];
}

/**
 * Get the branch and file information from git status run with porcelain 2.
 * @param porcelainStatus The complete string from the porcelain 2 status command
 * @returns
 */
export function parseGitPorcelainStatus(porcelainStatus: string): PorcelainStatus | undefined {
  if (!porcelainStatus) {
    return;
  }

  const branch: BranchInfo = {
    name: "",
    commit: "",
  };
  const files: StatusInfo[] = [];
  porcelainStatus.split("\n").forEach((statusRow) => {
    if (!statusRow) {
      return;
    }

    if (statusRow.startsWith("#")) {
      parseBranchHeaders(statusRow, branch);
    } else {
      files.push(parseGitFileStatus(statusRow));
    }
  });

  return { branch, files };
}
