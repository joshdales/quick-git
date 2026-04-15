import { useMemo } from "react";
import { ActionPanel, List } from "@raycast/api";
import { showFailureToast, useExec } from "@raycast/utils";
import { parseGitStatusPorcelain } from "../utils/git-status/porcelain.js";
import { useRepoStorage } from "../hooks/useRepo.js";
import { GitStatusItem } from "./GitStatus/GitStatusItem.js";
import { RemoteGitActions } from "./GitStatus/RemoteGitActions.js";
import { GitStatusEmpty } from "./GitStatus/GitStatusEmpty.js";
import { ChangeCurrentBranch } from "./actions/ChangeCurrentBranch.js";
import { SetRepo } from "./actions/SetRepo.js";
import { Providers } from "./Providers.js";

const statusActions = (
  <>
    <ChangeCurrentBranch />
    <RemoteGitActions />
    <SetRepo title="Change Current Repo" />
  </>
);

export function GitStatus() {
  const repo = useRepoStorage();
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
    <Providers repo={repo.value} checkStatus={revalidate}>
      <List
        searchBarPlaceholder="Search modified files…"
        navigationTitle="Git Status"
        isShowingDetail={showDetails}
        isLoading={repo.isLoading || isLoading}
        actions={<ActionPanel>{repo.value ? <SetRepo /> : statusActions}</ActionPanel>}
      >
        {statusItems}
      </List>
    </Providers>
  );
}
