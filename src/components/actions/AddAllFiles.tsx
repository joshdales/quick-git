import { Action, Icon, showToast } from "@raycast/api";
import { showFailureToast, useExec } from "@raycast/utils";
import { useRepo } from "../../hooks/useRepo.js";

interface Props {
  checkStatus: () => void;
}

export function AddAllFiles({ checkStatus }: Props) {
  const repo = useRepo();
  const { revalidate } = useExec("git", ["add", "."], {
    cwd: repo,
    execute: false,
    onData: () => {
      checkStatus();
      showToast({ title: "Added files" });
    },
    onError: (error) => {
      showFailureToast(error, { title: "Could not stage files" });
    },
  });

  return (
    <Action
      title="Add All Files"
      icon={Icon.PlusCircle}
      onAction={revalidate}
      shortcut={{ key: "a", modifiers: ["cmd", "shift"] }}
    />
  );
}
