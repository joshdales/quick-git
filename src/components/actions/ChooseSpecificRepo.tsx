import { Action } from "@raycast/api";
import { ChooseDirectory } from "../forms/ChooseDirectory.js";

export function ChooseSpecificRepo() {
  return <Action.Push title="Choose Specific Repo" target={<ChooseDirectory />} />;
}
