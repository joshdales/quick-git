import { useLocalStorage } from "@raycast/utils";
import { createContext, useContext } from "react";

type RawSelectedRepo = ReturnType<typeof useLocalStorage<string>>;
export type SelectedRepo = Pick<RawSelectedRepo, "isLoading" | "removeValue" | "setValue"> & {
  value: string;
};

export const RepoContext = createContext<SelectedRepo>({
  // null is used to indicate that context has not been initialized
  value: null as unknown as string,
  setValue: () => {
    throw Error("Cannot set repo value: RepoContext was not initialized");
  },
  removeValue: () => {
    throw Error("Cannot remove repo value: RepoContext was not initialized");
  },
  isLoading: false,
});

export function useSelectedRepoStorage(): RawSelectedRepo {
  return useLocalStorage<string>("selectedRepo");
}

export function useRepo(): string {
  const { value } = useContext(RepoContext);
  if (value === null) {
    throw new Error("Cannot get repo value: RepoContext was not initialized");
  }

  return value;
}

export function useSelectedRepo(): SelectedRepo {
  const repo = useContext(RepoContext);
  if (repo.value === null) {
    throw new Error("Cannot get repo data: RepoContext was not initialized");
  }

  return repo;
}
