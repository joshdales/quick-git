import { BranchInfo, parseBranchHeaders } from "./branch.js";
import { parsePorcelainStatus, type XYStatus as GitStatus } from "./porcelain.js";
export type { GitStatus };

type GitStatusFormat = "changed" | "renamed" | "unmerged" | "untracked" | "ignored";

export interface StatusInfo {
  format: GitStatusFormat;
  /** Path of the file */
  fileName: string;
  /** Original path of the file if it was renamed/copied */
  origPath?: string;
  /** Status of the index */
  staged: GitStatus;
  /** Status of the working tree */
  unstaged: GitStatus;
  /** Is this a submodule */
  submodule?: boolean;
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
  const fields = parsePorcelainStatus(dataRow);
  if (fields.indicator === "?" || fields.indicator === "!") {
    return {
      format: "untracked",
      fileName: fields.path,
      staged: ".",
      unstaged: fields.indicator,
    };
  }
  const format = lineFormat(fields.indicator);

  return {
    format,
    fileName: fields.path,
    origPath: fields.indicator === "2" ? fields.origPath : undefined,
    staged: fields.indexChanges,
    unstaged: fields.workingChanges,
    submodule: fields.submodule.isSubmodule,
  };
}

export function parseGitStatus(porcelainStatus: string):
  | {
      branch: BranchInfo;
      files: StatusInfo[];
    }
  | undefined {
  if (!porcelainStatus) {
    return;
  }

  const status = porcelainStatus.split("\n");
  const branch: BranchInfo = {
    name: "",
    commit: "",
  };
  const files: StatusInfo[] = [];
  status.forEach((statusRow) => {
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
