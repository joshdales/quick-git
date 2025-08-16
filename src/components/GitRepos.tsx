import { useCallback, useMemo } from "react";
import { Action, ActionPanel, getPreferenceValues, List, showToast, Toast } from "@raycast/api";
import { showFailureToast, useExec, useFrecencySorting } from "@raycast/utils";
import { ChooseDirectory } from "./forms/ChooseDirectory.js";
import { parseRepoDirectoryName, RepoDir } from "../utils/repos.js";
import { RepoContext, useRepoStorage } from "../hooks/useRepo.js";
import { GitRepoItem } from "./GitRepos/GitRepoItem.js";
import { launchQuickGit } from "../utils/launchCommands.js";

export function GitRepos() {
  const currentRepo = useRepoStorage();
  const prefs = getPreferenceValues<Preferences>();
  const { data, isLoading } = useExec(
    "find",
    [".", "-name .git", "-type d", "-prune", "-exec", "dirname", "{}", "\\;"],
    {
      cwd: prefs["repo-locations"],
      shell: true,
      parseOutput: ({ stdout }) => {
        return parseRepoDirectoryName(stdout, prefs["repo-locations"]);
      },
      onError: (error) => {
        showFailureToast(error, { title: "Could not get git repos" });
      },
      stripFinalNewline: true,
    },
  );
  const { data: sortedData, visitItem } = useFrecencySorting(data);

  const changeRepo = useCallback(
    (item: RepoDir) => {
      visitItem(item);
      currentRepo.setValue(item.id).then(() => {
        showToast({
          style: Toast.Style.Success,
          title: "Repo set",
          message: item.label,
        });

        launchQuickGit();
      });
    },
    [currentRepo, visitItem],
  );

  const repos = useMemo(() => {
    if (!sortedData?.length) {
      return <List.EmptyView title="There are no git repositories" />;
    }

    return sortedData.map((repo) => (
      <GitRepoItem key={repo.id} repoDir={repo} isSelected={repo.id === currentRepo.value} changeRepo={changeRepo} />
    ));
  }, [changeRepo, currentRepo.value, sortedData]);

  return (
    <RepoContext value={currentRepo.value ?? ""}>
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
    </RepoContext>
  );
}
