import { SubmoduleString } from "./submodule.js";

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
type XYString = `${StatusValue}${StatusValue}`;

/**
 * The type of change that has occurred for this file and format the the line will take.
 * - `1` Ordinary changed entry
 * - `2` Renamed or copied entry
 * - `u` Unmerged entry
 * - `?` Untracked entry
 * - `!` Ignored entry
 */
type LineIndicator = "1" | "2" | "u" | "?" | "!";

/** All possible options that can be in a line. */
interface LineFormat {
  /** The type of line format that the change represents */
  indicator: LineIndicator;
  /** Status of the index and working tree */
  xy: XYString;
  /** Status of the git submodule */
  submodule: SubmoduleString;
  /** The octal file mode in HEAD */
  mH: string;
  /** The octal file mode in the index */
  mI: string;
  /** The octal file mode in the worktree */
  mW: string;
  /** The octal file mode in stage 1. */
  m1: string;
  /** The octal file mode in stage 2. */
  m2: string;
  /** The octal file mode in stage 3. */
  m3: string;
  /** The object name in HEAD */
  hH: string;
  /** The object name in the index */
  hI: string;
  /** The object name in stage 1. */
  h1: string;
  /** The object name in stage 2. */
  h2: string;
  /** The object name in stage 3. */
  h3: string;
  /** Rename or copy */
  rc: "R" | "C";
  /** Score denoting the percentage of similarity between the source and target of the move or copy */
  rcScore: number;
  /** The pathname. In a renamed/copied entry, this is the target path */
  path: string;
  /** The pathname in the commit at HEAD or in the index */
  origPath: string;
}

interface ChangedFile
  extends Pick<LineFormat, "indicator" | "xy" | "submodule" | "mH" | "mI" | "mW" | "hH" | "hI" | "path"> {
  indicator: "1";
}
interface RenamedFile
  extends Pick<
    LineFormat,
    "indicator" | "xy" | "submodule" | "mH" | "mI" | "mW" | "hH" | "hI" | "rc" | "rcScore" | "path" | "origPath"
  > {
  indicator: "2";
}
interface UnmergedFile
  extends Pick<LineFormat, "indicator" | "xy" | "submodule" | "m1" | "m2" | "m3" | "mW" | "h1" | "h2" | "h3" | "path"> {
  indicator: "u";
}
interface UntrackedFile extends Pick<LineFormat, "indicator" | "path"> {
  indicator: "?";
}
interface IgnoredFile extends Pick<LineFormat, "indicator" | "path"> {
  indicator: "!";
}

export type FileStatus = ChangedFile | RenamedFile | UnmergedFile | UntrackedFile | IgnoredFile;

/**
 * Parse a line from Git Status Porcelain version 2 and return an object containing that information.
 */
export function parseFileStatus(line: string): FileStatus {
  const indicator = line.charAt(0) as LineIndicator;

  switch (indicator) {
    case "1":
      return parseChangedFile(line);
    case "2":
      return parseRenamedFile(line);
    case "u":
      return parseUnmergedFile(line);
    default: {
      const [, ...paths] = line.split(spaceRegex);
      const [path] = parsePaths(paths);
      return {
        indicator,
        path,
      };
    }
  }
}

/**
 * Split the indicated changes into a tuple
 * @param xy Two character field indicating staged and unstaged changes
 * @returns The changes that are staged, and the working changed
 */
export function parseChanges(xy: XYString): [StatusValue, StatusValue] {
  return [xy.charAt(0) as StatusValue, xy.charAt(1) as StatusValue];
}

/** Match unescaped space characters, in case there are spaces in a filename */
const spaceRegex = /(?<!\\) /;

/**
 * Get the path name from an array of strings that come from splitting the original line apart.
 * @returns A tuple of the current path, and the original path in the case that the file was renamed.
 */
function parsePaths(strings: string[]): [string, string] {
  const rejoinedPaths = strings.join(" ");
  // in the case of a rename pathnames are separated by a tab character
  const [path, origPath] = rejoinedPaths.split(/\t/);
  return [path, origPath];
}

function parseChangedFile(line: string): ChangedFile {
  const [, xy, sub, mH, mI, mW, hH, hI, ...paths] = line.split(spaceRegex);
  const [path] = parsePaths(paths);

  return {
    indicator: "1",
    xy: xy as XYString,
    submodule: sub as SubmoduleString,
    mH,
    mI,
    mW,
    hH,
    hI,
    path,
  };
}

function parseRenamedFile(line: string): RenamedFile {
  const [, xy, sub, mH, mI, mW, hH, hI, xScore, ...paths] = line.split(spaceRegex);
  const [rc, score] = xScore.split(/\s/) as ["R" | "C", string];
  const [path, origPath] = parsePaths(paths);

  return {
    indicator: "2",
    xy: xy as XYString,
    submodule: sub as SubmoduleString,
    mH,
    mI,
    mW,
    hH,
    hI,
    rc,
    rcScore: +score,
    path,
    origPath,
  };
}

function parseUnmergedFile(line: string): UnmergedFile {
  const [, xy, sub, m1, m2, m3, mW, h1, h2, h3, ...paths] = line.split(spaceRegex);
  const [path] = parsePaths(paths);

  return {
    indicator: "u",
    xy: xy as XYString,
    submodule: sub as SubmoduleString,
    m1,
    m2,
    m3,
    mW,
    h1,
    h2,
    h3,
    path,
  };
}
