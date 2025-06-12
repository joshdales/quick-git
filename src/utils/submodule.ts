export interface SubmoduleStatus {
  isSubmodule: boolean;
  commitHasChanged: boolean;
  hasTrackedChanges: boolean;
  hasUntrackedChanges: boolean;
}

/**
 * Parse submodule status from poreclain version 2.
 * @param sub A 4 character field describing the submodule state
 */
export function parseSubmodule(sub: string): SubmoduleStatus {
  if (!sub || sub === "N...") {
    return {
      isSubmodule: false,
      commitHasChanged: false,
      hasTrackedChanges: false,
      hasUntrackedChanges: false,
    };
  }

  return {
    isSubmodule: sub.charAt(0) === "S",
    commitHasChanged: sub.charAt(1) === "C",
    hasTrackedChanges: sub.charAt(2) === "M",
    hasUntrackedChanges: sub.charAt(3) === "U",
  };
}
