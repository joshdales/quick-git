import { ActionPanel } from "@raycast/api";
import { RemoteGitActions } from "./RemoteGitActions.js";
import { AddFile } from "../actions/AddFile.js";
import { UnstageFile } from "../actions/UnstageFile.js";
import { CommitMessage } from "../actions/CommitMessage.js";
import { RestoreFile } from "../actions/RestoreFile.js";
import { ChangeCurrentBranch } from "../actions/ChangeCurrentBranch.js";
import { SetRepo } from "../actions/SetRepo.js";
import { CopyFilename } from "../actions/CopyFilename.js";
import { OpenFile } from "../actions/OpenFile.js";
import { AddAllFiles } from "../actions/AddAllFiles.js";
import { UnstageAllFiles } from "../actions/UnstageAllFiles.js";
import { StashAllFiles } from "../actions/StashAllFiles.js";

interface Props {
  isNotStaged: boolean;
  isCommittedFile: boolean;
  fileName: string;
  checkStatus: () => void;
}

export function GitStatusItemActions({ isNotStaged, isCommittedFile, fileName, checkStatus }: Props) {
  return (
    <ActionPanel>
      <ActionPanel.Section>
        {isNotStaged ? (
          <AddFile fileName={fileName} checkStatus={checkStatus} />
        ) : (
          <UnstageFile fileName={fileName} checkStatus={checkStatus} />
        )}
        <CommitMessage checkStatus={checkStatus} />
        {isNotStaged && isCommittedFile ? <RestoreFile fileName={fileName} checkStatus={checkStatus} /> : null}
      </ActionPanel.Section>

      <ChangeCurrentBranch checkStatus={checkStatus} />

      <ActionPanel.Section title="Bulk Actions">
        <AddAllFiles checkStatus={checkStatus} />
        <UnstageAllFiles checkStatus={checkStatus} />
        <StashAllFiles checkStatus={checkStatus} />
      </ActionPanel.Section>

      <RemoteGitActions checkStatus={checkStatus} />

      <ActionPanel.Section title="Utilities">
        <SetRepo />
        <CopyFilename fileName={fileName} />
        <OpenFile fileName={fileName} />
      </ActionPanel.Section>
    </ActionPanel>
  );
}
