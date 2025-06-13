import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import { join } from "node:path";
import { Action, getDefaultApplication, Image, Keyboard } from "@raycast/api";
import { useRepo } from "../../hooks/useRepo.js";

interface Props {
  fileName: string;
}

export function OpenFile({ fileName }: PropsWithChildren<Props>) {
  const [appIcon, setAppIcon] = useState<Image.ImageLike>();
  const { value } = useRepo();
  const filePath = useMemo(() => join(value ?? "", fileName), [fileName, value]);

  useEffect(() => {
    if (!value) return;
    getDefaultApplication(filePath)
      .then((app) => {
        setAppIcon({ fileIcon: app.path });
      })
      .catch((err) => {
        console.error(err);
      });
  }, [filePath, value]);

  return <Action.Open title="Open File" target={filePath} icon={appIcon} shortcut={Keyboard.Shortcut.Common.Open} />;
}
