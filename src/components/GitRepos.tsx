import { useMemo } from "react";
import { Action, ActionPanel, getPreferenceValues, List } from "@raycast/api";
import { showFailureToast, useExec, useFrecencySorting } from "@raycast/utils";
import { ChooseDirectory } from "./forms/ChooseDirectory.js";
import { parseRepoDirectoryName } from "../utils/repos.js";

export function GitRepos() {
  const prefs = getPreferenceValues<Preferences>();
  const { data, isLoading } = useExec(
    "find",
    [".", "-name .git", "-type d", "-prune", "-exec", "dirname", "{}", "\\;"],
    {
      cwd: prefs["repo-locations"],
      shell: true,
      parseOutput: ({ stdout }) => {
        return parseRepoDirectoryName(stdout);
      },
      onError: (error) => {
        showFailureToast(error, { title: "Could not get git repos" });
      },
      stripFinalNewline: true,
    },
  );
  const { data: sortedData } = useFrecencySorting(data);

  const repos = useMemo(() => {
    if (!sortedData?.length) {
      return <List.EmptyView title="There are no git repositories" />;
    }
    return sortedData.map((repo) => <List.Item key={repo.id} title={repo.label} />);
  }, [sortedData]);

  return (
    <List
      searchBarPlaceholder="Search git repos…"
      navigationTitle="Change Git Repo"
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.Push title="Choose Specific Repo" target={<ChooseDirectory />} />
        </ActionPanel>
      }
    >
      {repos}
    </List>
  );
}
