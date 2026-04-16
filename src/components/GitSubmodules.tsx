import { useCachedPromise } from "@raycast/utils";
import { parseSubmoduleKey, submodulesConfig } from "../utils/submodules.js";
import { ReactElement, useMemo } from "react";
import { List } from "@raycast/api";
import { GitSubmoduleItem } from "./GitSubmodules/GitSubmoduleItem.js";
import { GitSubmodulesEmpty } from "./GitSubmodules/GitSubmodulesEmpty.js";
import { Providers } from "./Providers.js";

interface Props {
  repo: string;
  changeRepo: (repoDir: string) => Promise<void>;
  checkStatus: () => void;
}

export function GitSubmodules({ changeRepo, repo, checkStatus }: Props) {
  const submodules = useCachedPromise(submodulesConfig, [repo]);

  const submoduleList = useMemo(() => {
    if (!submodules.data) {
      return <GitSubmodulesEmpty />;
    }

    return (
      <>
        {Object.entries(submodules.data).reduce<ReactElement[]>((list, [key, value]) => {
          const keyName = parseSubmoduleKey(key);
          if (!keyName) {
            return list;
          }

          list.push(
            <GitSubmoduleItem key={key} dir={keyName} path={value.path} url={value.url} updateRepo={changeRepo} />,
          );
          return list;
        }, [])}
      </>
    );
  }, [changeRepo, submodules.data]);

  return (
    <Providers repo={repo} checkStatus={checkStatus}>
      <List isLoading={submodules.isLoading}>{submoduleList}</List>;
    </Providers>
  );
}
