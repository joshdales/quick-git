import { useMemo } from "react";
import { ActionPanel, List } from "@raycast/api";
import { showFailureToast, useExec } from "@raycast/utils";
import { parseGitStatusPorcelain } from "../utils/git-status/porcelain.js";
import { useSelectedRepoStorage } from "../hooks/useRepo.js";
import { GitStatusItem } from "./GitStatus/GitStatusItem.js";
import { RemoteGitActions } from "./GitStatus/RemoteGitActions.js";
import { GitStatusEmpty } from "./GitStatus/GitStatusEmpty.js";
import { ChangeCurrentBranch } from "./actions/ChangeCurrentBranch.js";
import { SetRepo } from "./actions/SetRepo.js";
import { Providers } from "./Providers.js";
import { useHasSubmodles } from "../hooks/useHasSubmodules.js";
import { ChangeSubmodules } from "./actions/ChangeSubmodules.js";
import { navigationTitle } from "../utils/navigationTitle.js";

export function GitStatus() {
  const repo = useSelectedRepoStorage();
  const { data: hasSubmodule, isLoading: checkingSubmodules } = useHasSubmodles(repo.value);
  const { data, isLoading, revalidate } = useExec("git", ["status", "--porcelain=2", "--branch"], {
    cwd: repo.value,
    execute: !!repo.value,
    keepPreviousData: false,
    onError: (error) => {
      showFailureToast(error, { title: "Could not fetch git status" });
    },
    parseOutput: ({ stdout }) => parseGitStatusPorcelain(stdout),
  });

  const showDetails = !!repo.value && !!data?.files.length;

  const statusActions = repo.value ? (
    <>
      <ChangeCurrentBranch />
      {hasSubmodule && <ChangeSubmodules changeRepo={repo.setValue} />}
      <RemoteGitActions />
      <SetRepo title="Change Current Repo" />
    </>
  ) : (
    <SetRepo />
  );

  const statusItems = useMemo(() => {
    if (!data?.files.length) {
      return (
        <GitStatusEmpty
          ahead={data?.branch.ahead}
          behind={data?.branch.behind}
          name={data?.branch.name}
          upstream={data?.branch.upstream}
        />
      );
    }

    return data.files.map((item) => <GitStatusItem key={item.fileName} status={item} branch={data.branch} />);
  }, [data]);

  return (
    <Providers repo={repo} checkStatus={revalidate}>
      <List
        searchBarPlaceholder="Search modified files…"
        navigationTitle={navigationTitle("Git Status", repo.value)}
        isShowingDetail={showDetails}
        isLoading={repo.isLoading || isLoading || checkingSubmodules}
        actions={<ActionPanel>{statusActions}</ActionPanel>}
      >
        {statusItems}
      </List>
    </Providers>
  );
}
