import { SwitchToBranch } from "../actions/SwitchToBranch.js";
import { DeleteBranch } from "../actions/DeleteBranch.js";
import { CreateNewBranch } from "../actions/CreateNewBranch.js";
import { SwitchToLastBranch } from "../actions/SwitchToLastBranch.js";
import { ActionPanel } from "@raycast/api";

interface Props {
  branch: string;
  isCurrentBranch: boolean;
  checkBranches: () => void;
  checkStatus: () => void;
}

export function GitBranchItemActions({ branch, isCurrentBranch, checkBranches }: Props) {
  return (
    <ActionPanel>
      {!isCurrentBranch ? (
        <>
          <SwitchToBranch branch={branch} checkBranches={checkBranches} />
          <DeleteBranch branch={branch} checkBranches={checkBranches} />
        </>
      ) : null}
      <CreateNewBranch checkBranches={checkBranches} />
      <SwitchToLastBranch checkBranches={checkBranches} />
    </ActionPanel>
  );
}
