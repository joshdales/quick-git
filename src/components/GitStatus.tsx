import { Action, ActionPanel, Icon, launchCommand, LaunchType, List } from "@raycast/api";
import type { GitStatus } from "../utils/status.js";
import { parseGitStatus } from "../utils/status.js";
import { GitStatusItem } from "./GitStatus/GitStatusItem.js";
import { showFailureToast, useExec } from "@raycast/utils";
import { RemoteGitActions } from "./GitStatus/RemoteGitActions.js";
import { GitStatusEmpty } from "./GitStatus/GitStatusEmpty.js";
import { GitBranches } from "./GitBranches.js";
import { useRepo } from "../hooks/useRepo.js";

const launchSetRepo = () =>
  launchCommand({
    name: "set-repo",
    type: LaunchType.UserInitiated,
  }).catch((error) => {
    showFailureToast(error, {
      title: "Could not launch the Set Quick Git Repo Command",
    });
  });

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
              <Action.Push icon={Icon.Switch} title="Switch Branch" target={<GitBranches checkStatus={revalidate} />} />
              <RemoteGitActions repo={repo} checkStatus={revalidate} />
              <Action icon={Icon.Folder} title="Change Current Repo" onAction={launchSetRepo} />
            </>
          ) : (
            <Action icon={Icon.Folder} title="Set Repo" onAction={launchSetRepo} />
          )}
        </ActionPanel>
      }
    >
      {repo && data?.files.length ? (
        data.files.map((item) => {
          return (
            <GitStatusItem
              key={item.fileName}
              repo={repo}
              status={item}
              branch={data.branch}
              checkStatus={revalidate}
            />
          );
        })
      ) : (
        <GitStatusEmpty repo={repo} branch={data?.branch} />
      )}
    </List>
  );
}
