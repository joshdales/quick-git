import { Action, Icon } from "@raycast/api";
import { showFailureToast, useExec } from "@raycast/utils";
import { useRepo } from "../../hooks/useRepo.js";

interface Props {
  fileName: string;
  updateDiff: (data: string) => void;
}

export function FileDiff({ fileName, updateDiff }: Props) {
  const { value: repo } = useRepo();
  const { revalidate } = useExec("git", ["diff", "--histogram", "head", fileName], {
    cwd: repo,
    execute: false,
    keepPreviousData: false,
    onData: (data) => {
      updateDiff(data);
    },
    onError: (error) => {
      showFailureToast(error, {
        title: `Could not generate diff for ${fileName}`,
      });
    },
  });

  return (
    <Action icon={Icon.CodeBlock} title="Show Diff" onAction={revalidate} shortcut={{ key: "d", modifiers: ["cmd"] }} />
  );
}
