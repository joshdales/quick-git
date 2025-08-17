import { List } from "@raycast/api";
import type { BranchInfo } from "../../utils/git-status/branch.js";
import type { StatusInfo } from "../../utils/git-status/porcelain.js";
import { GitStatusTags } from "./GitStatusTags.js";
import { useMemo } from "react";

interface Props {
  branch: BranchInfo;
  status: StatusInfo;
  diff: string;
}

export function GitStatusItemDetail({ branch, status, diff }: Props) {
  const upstreamData = useMemo(() => {
    if (!branch.upstream) {
      return null;
    }

    return (
      <>
        <List.Item.Detail.Metadata.Label title="Upstream" text={branch.upstream} />
        <List.Item.Detail.Metadata.Label title="Ahead" text={`${branch.ahead} commits`} />
        <List.Item.Detail.Metadata.Label title="Behind" text={`${branch.behind} commits`} />
      </>
    );
  }, [branch.ahead, branch.behind, branch.upstream]);

  const diffMarkdown = useMemo(() => {
    if (!diff) {
      return null;
    }

    return "```diff\n" + diff;
  }, [diff]);

  return (
    <List.Item.Detail
      markdown={diffMarkdown}
      metadata={
        <List.Item.Detail.Metadata>
          <List.Item.Detail.Metadata.Label title="File path" text={status.fileName} />
          {status.origPath ? <List.Item.Detail.Metadata.Label title="Original path" text={status.origPath} /> : null}
          <GitStatusTags changes={status.changes} />
          <List.Item.Detail.Metadata.Separator />
          <List.Item.Detail.Metadata.Label title="Branch" text={branch.name} />
          {upstreamData}
        </List.Item.Detail.Metadata>
      }
    />
  );
}
