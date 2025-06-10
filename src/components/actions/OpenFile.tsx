import { PropsWithChildren, useMemo } from "react";
import { join } from "node:path";
import { Action, Keyboard } from "@raycast/api";
import { useRepo } from "../../hooks/useRepo.js";

interface Props {
  fileName: string;
}

export function OpenFile({ fileName }: PropsWithChildren<Props>) {
  const { value } = useRepo();
  const filePath = useMemo(() => join(value ?? "", fileName), [fileName, value]);

  return <Action.Open title="Open File" target={filePath} shortcut={Keyboard.Shortcut.Common.Open} />;
}
