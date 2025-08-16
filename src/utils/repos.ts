export function parseRepoDirectoryName(repoList: string): { id: string; label: string }[] {
  if (!repoList) return [];

  return repoList.split("\n").reduce<{ id: string; label: string }[]>((currList, value) => {
    if (!value || value.endsWith("Operation not permitted")) {
      return currList;
    }
    currList.push({ id: value, label: value.replace(/(^\.\/)/, "") });
    return currList;
  }, []);
}
