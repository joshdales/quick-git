export type GitStatus =
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

type LineIndicator = "1" | "2" | "u" | "?" | "!";

interface LineFormat {
  indicator: LineIndicator;
  /** Staged and unstaged XY values described in the short format */
  xy: [GitStatus, GitStatus];
  /** Submodule */
  sub: string;
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
  /** RC Score - denoting the percentage of similarity between the source and target of the move or copy */
  rcScore: number;
  /** The pathname. In a renamed/copied entry, this is the target path */
  path: string;
  /** The pathname in the commit at HEAD or in the index */
  origPath: string;
}

interface ChangedFile extends Pick<LineFormat, "indicator" | "xy" | "sub" | "mH" | "mI" | "mW" | "hH" | "hI" | "path"> {
  indicator: "1";
}
interface RenamedFile
  extends Pick<
    LineFormat,
    "indicator" | "xy" | "sub" | "mH" | "mI" | "mW" | "hH" | "hI" | "rc" | "rcScore" | "path" | "origPath"
  > {
  indicator: "2";
}
interface UnmergedFile
  extends Pick<LineFormat, "indicator" | "xy" | "sub" | "m1" | "m2" | "m3" | "mW" | "h1" | "h2" | "h3" | "path"> {
  indicator: "u";
}
interface UntrackedFile extends Pick<LineFormat, "indicator" | "path"> {
  indicator: "?";
}
interface IgnoredFile extends Pick<LineFormat, "indicator" | "path"> {
  indicator: "!";
}

export type PorcelainStatus = ChangedFile | RenamedFile | UnmergedFile | UntrackedFile | IgnoredFile;

function parseChangedFile(line: string): ChangedFile {
  const [, xy, sub, mH, mI, mW, hH, hI, path] = line.split(" ");
  return {
    indicator: "1",
    xy: xy.split("") as [GitStatus, GitStatus],
    sub,
    mH,
    mI,
    mW,
    hH,
    hI,
    path,
  };
}

function parseRenamedFile(line: string): RenamedFile {
  const [, xy, sub, mH, mI, mW, hH, hI, xScore, completePath] = line.split(" ");
  const [rc, score] = xScore.split(/\s/);
  const [path, origPath] = completePath.split(/\s/);

  return {
    indicator: "2",
    xy: xy.split("") as [GitStatus, GitStatus],
    sub,
    mH,
    mI,
    mW,
    hH,
    hI,
    rc: rc as "R" | "C",
    rcScore: +score,
    path,
    origPath,
  };
}

function parseUnmergedFile(line: string): UnmergedFile {
  const [, xy, sub, m1, m2, m3, mW, h1, h2, h3, path] = line.split(" ");
  return {
    indicator: "u",
    xy: xy.split("") as [GitStatus, GitStatus],
    sub,
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

function parseUntrackedFile(line: string): UntrackedFile {
  const [, path] = line.split(" ");
  return {
    indicator: "?",
    path,
  };
}

function parseIgnoredFile(line: string): IgnoredFile {
  const [, path] = line.split(" ");
  return {
    indicator: "!",
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
    case "?":
      return parseUntrackedFile(line);
    case "!":
      return parseIgnoredFile(line);
  }
}
