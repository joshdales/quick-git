export interface SubmoduleStatus {
  isSubmodule: boolean;
  commitHasChanged: boolean;
  hasTrackedChanges: boolean;
  hasUntrackedChanges: boolean;
}

/**
 * Parse submodule status from poreclain version 2.
 * @param {string} sub A 4 character field describing the submodule state
 */
export function parseSubmodule(sub: string): SubmoduleStatus {
  const isSubmodule = sub.charAt(0) === "S";
  if (!isSubmodule) {
    return {
      isSubmodule: false,
      commitHasChanged: false,
      hasTrackedChanges: false,
      hasUntrackedChanges: false,
    };
  }
  const commitHasChanged = sub.charAt(1) === "C";
  const hasTrackedChanges = sub.charAt(2) === "M";
  const hasUntrackedChanges = sub.charAt(3) === "U";

  return {
    isSubmodule,
    commitHasChanged,
    hasTrackedChanges,
    hasUntrackedChanges,
  };
}
