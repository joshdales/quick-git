import { Action, Icon, Keyboard, open, showToast, Toast } from "@raycast/api";
import { showFailureToast, useExec } from "@raycast/utils";
import { useRepo } from "../../hooks/useRepo.js";
import { useCheckStatus } from "../../hooks/useCheckStatus.js";
import { codeReviewUrl } from "../../utils/code-review.js";

export function PushBranch() {
  const repo = useRepo();
  const checkStatus = useCheckStatus();

  const { revalidate: forcePush } = useExec("git", ["push", "--force-with-lease"], {
    cwd: repo,
    execute: false,
    onWillExecute: () => {
      showToast({ title: "Pushing branch", style: Toast.Style.Animated });
    },
    onData: () => {
      checkStatus();
      showToast({ title: "Remote up to date" });
    },
    onError: (error) => {
      showFailureToast(error, { title: "Could not push this branch" });
    },
  });

  const { revalidate } = useExec("git", ["push"], {
    cwd: repo,
    execute: false,
    onWillExecute: () => {
      showToast({ title: "Pushing branch", style: Toast.Style.Animated });
    },
    parseOutput: ({ stdout }) => {
      return codeReviewUrl(stdout);
    },
    onData: (codeReview) => {
      checkStatus();
      let primaryAction: Toast.ActionOptions | undefined;
      if (codeReview) {
        primaryAction = {
          onAction: () => {
            open(codeReview);
          },
          title: "Open code review",
        };
      }
      showToast({ title: "Remote up to date", primaryAction });
    },
    onError: (error) => {
      showFailureToast(error, {
        title: "Could not push this branch",
        primaryAction: {
          onAction: forcePush,
          title: "Force Push Branch?",
        },
      });
    },
  });

  return <Action title="Push" icon={Icon.Upload} onAction={revalidate} shortcut={Keyboard.Shortcut.Common.MoveUp} />;
}
