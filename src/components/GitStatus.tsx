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
  const { value: repo, isLoading: isLoadingRepo } = useRepo();
  const { data, isLoading, revalidate } = useExec("git", ["status", "--porcelain=2", "--branch"], {
    cwd: repo,
    execute: !!repo,
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
      isShowingDetail={!!repo && !!data?.files.length}
      isLoading={isLoadingRepo || isLoading}
      actions={
        <ActionPanel>
          {repo ? (
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
      {repo && data?.files.length ? (
        data.files.map((item) => {
          return <GitStatusItem key={item.fileName} status={item} branch={data.branch} checkStatus={revalidate} />;
        })
      ) : (
        <GitStatusEmpty repo={repo} branch={data?.branch} />
      )}
    </List>
  );
}
