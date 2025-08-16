import { ActionPanel, List } from "@raycast/api";
import { useCallback, useMemo } from "react";
import { RepoDir } from "../../utils/repos.js";
import { SelectCurrentRepo } from "../actions/ChangeCurrentRepo.js";
import { ChooseSpecificRepo } from "../actions/ChooseSpecificRepo.js";
import { OpenDirectory } from "../actions/OpenDirectory.js";

interface Props {
  repoDir: RepoDir;
  isSelected: boolean;
  changeRepo: (item: RepoDir) => void;
}

export function GitRepoItem({ repoDir, isSelected, changeRepo }: Props) {
  const accessories = useMemo(() => {
    if (isSelected) {
      return [{ text: "Current Repo" }];
    }
  }, [isSelected]);

  const selectRepo = useCallback(() => {
    changeRepo(repoDir);
  }, [changeRepo, repoDir]);

  const actions = useMemo(() => {
    return (
      <ActionPanel>
        {isSelected ? null : <SelectCurrentRepo selectRepo={selectRepo} />}
        <OpenDirectory path={repoDir.id} />
        <ChooseSpecificRepo />
      </ActionPanel>
    );
  }, [isSelected, repoDir.id, selectRepo]);

  return <List.Item title={repoDir.label} accessories={accessories} actions={actions} />;
}
