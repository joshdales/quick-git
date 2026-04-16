import { useCachedPromise } from "@raycast/utils";
import { hasSubmodules } from "../utils/submodules.js";

export function useHasSubmodles(repo = "") {
  return useCachedPromise(hasSubmodules, [repo], { execute: !!repo });
}
