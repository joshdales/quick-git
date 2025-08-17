import { SubmoduleStatus, parseSubmodule } from "./submodule.js";

export type XYStatus =
  | /** unmodified */
  "."
  /** modified */
  | "M"
  /** file type changed (regular file, symbolic link or submodule) */
  | "T"
  /** added */
  | "A"
  /** deleted */
  | "D"
  /** renamed */
  | "R"
  /** copied (if config option status.renames is set to "copies") */
  | "C"
  /** updated but unmerged */
  | "U"
  /** untracked */
  | "?"
  /** ignored */
  | "!";

type LineIndicator =
  | /** Ordinary changed entry */
  "1"
  /** Renamed or copied entry */
  | "2"
  /** Unmerged entry */
  | "u"
  /** Untracked entry */
  | "?"
  /** Ignored entry */
  | "!";

interface LineFormat {
  indicator: LineIndicator;
  /** Status of the index */
  indexChanges: XYStatus;
  /** Status of the woking tree */
  workingChanges: XYStatus;
  /** Status of the git submodule */
  submodule: SubmoduleStatus;
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
  extends Pick<
    LineFormat,
    "indicator" | "indexChanges" | "workingChanges" | "submodule" | "mH" | "mI" | "mW" | "hH" | "hI" | "path"
  > {
  indicator: "1";
}
interface RenamedFile
  extends Pick<
    LineFormat,
    | "indicator"
    | "indexChanges"
    | "workingChanges"
    | "submodule"
    | "mH"
    | "mI"
    | "mW"
    | "hH"
    | "hI"
    | "rc"
    | "rcScore"
    | "path"
    | "origPath"
  > {
  indicator: "2";
}
interface UnmergedFile
  extends Pick<
    LineFormat,
    | "indicator"
    | "indexChanges"
    | "workingChanges"
    | "submodule"
    | "m1"
    | "m2"
    | "m3"
    | "mW"
    | "h1"
    | "h2"
    | "h3"
    | "path"
  > {
  indicator: "u";
}
interface UntrackedFile extends Pick<LineFormat, "indicator" | "path"> {
  indicator: "?";
}
interface IgnoredFile extends Pick<LineFormat, "indicator" | "path"> {
  indicator: "!";
}

export type PorcelainStatus = ChangedFile | RenamedFile | UnmergedFile | UntrackedFile | IgnoredFile;

function parseChanges(xy: string): [XYStatus, XYStatus] {
  return [xy.charAt(0) as XYStatus, xy.charAt(1) as XYStatus];
}

/** Match unescaped space characters, in case there are spaces in a filename */
const spaceRegex = /(?<!\\) /;

function parsePaths(strings: string[]): [string, string] {
  const rejoinedPaths = strings.join(" ");
  // in the case of a rename pathnames are separated by a tab character
  const [path, origPath] = rejoinedPaths.split(/\t/);
  return [path, origPath];
}

function parseChangedFile(line: string): ChangedFile {
  const [, xy, sub, mH, mI, mW, hH, hI, ...paths] = line.split(spaceRegex);
  const [indexChanges, workingChanges] = parseChanges(xy);
  const [path] = parsePaths(paths);

  return {
    indicator: "1",
    indexChanges,
    workingChanges,
    submodule: parseSubmodule(sub),
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
  const [indexChanges, workingChanges] = parseChanges(xy);
  const [rc, score] = xScore.split(/\s/) as ["R" | "C", string];
  const [path, origPath] = parsePaths(paths);

  return {
    indicator: "2",
    indexChanges,
    workingChanges,
    submodule: parseSubmodule(sub),
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
  const [indexChanges, workingChanges] = parseChanges(xy);
  const [path] = parsePaths(paths);

  return {
    indicator: "u",
    indexChanges,
    workingChanges,
    submodule: parseSubmodule(sub),
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

export function parsePorcelainStatus(line: string): PorcelainStatus {
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
