import { Action, Icon, Keyboard, showToast } from "@raycast/api";
import { showFailureToast, useExec } from "@raycast/utils";
import { useRepo } from "../../hooks/useRepo.js";

interface Props {
  fileName: string;
  checkStatus: () => void;
}

export function RestoreStagedFile({ checkStatus }: Props) {
  const { value } = useRepo();
  const { revalidate: unstageAllFiles } = useExec("git", ["restore", "--staged", "."], {
    cwd: value,
    execute: false,
    onData: () => {
      checkStatus();
      showToast({ title: "Unstaged files" });
    },
    onError: (error) => {
      showFailureToast(error, { title: "Could not unstage files" });
    },
  });

  return (
    <Action
      title="Restore Staged Files"
      onAction={unstageAllFiles}
      icon={Icon.MinusCircle}
      shortcut={Keyboard.Shortcut.Common.RemoveAll}
    />
  );
}
