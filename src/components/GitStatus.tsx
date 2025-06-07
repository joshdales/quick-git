import { ActionPanel, List } from "@raycast/api";
import type { GitStatus } from "../utils/status.js";
import { parseGitStatus } from "../utils/status.js";
import { GitStatusItem } from "./GitStatus/GitStatusItem.js";
import { showFailureToast, useExec } from "@raycast/utils";
import { RemoteGitActions } from "./GitStatus/RemoteGitActions.js";
import { GitStatusEmpty } from "./GitStatus/GitStatusEmpty.js";
import { useRepo } from "../hooks/useRepo.js";
import { ChangeCurrentBranch } from "./actions/ChangeCurrentBranch.js";
import { SetRepo } from "./actions/SetRepo.js";

export function GitStatus() {
  const repo = useRepo();
  const { data, isLoading, revalidate } = useExec("git", ["status", "--porcelain=2", "--branch"], {
    cwd: repo.value,
    execute: !!repo.value,
    keepPreviousData: false,
    onError: (error) => {
      showFailureToast(error, { title: "Could not fetch git status" });
    },
    parseOutput: ({ stdout }) => parseGitStatus(stdout),
  });

  return (
    <List
      searchBarPlaceholder="Search modified files…"
      navigationTitle="Git Status"
      isShowingDetail={!!repo.value && !!data?.files.length}
      isLoading={repo.isLoading || isLoading}
      actions={
        <ActionPanel>
          {repo.value ? (
            <>
              <ChangeCurrentBranch checkStatus={revalidate} />
              <RemoteGitActions checkStatus={revalidate} />
              <SetRepo title="Change Current Repo" />
            </>
          ) : (
            <SetRepo />
          )}
        </ActionPanel>
      }
    >
      {repo.value && data?.files.length ? (
        data.files.map((item) => {
          return <GitStatusItem key={item.fileName} status={item} branch={data.branch} checkStatus={revalidate} />;
        })
      ) : (
        <GitStatusEmpty branch={data?.branch} />
      )}
    </List>
  );
}
