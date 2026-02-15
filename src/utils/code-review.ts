/**
 * See if there is a URL in the push command that you can open an MR from
 * @param pushReport The string returned from a push command
 * @returns The matching new code review URL if any
 */
export function codeReviewUrl(pushReport: string): string | undefined {
  if (!pushReport) return undefined;
  const match = /remote:\s*(?<url>https.*)/.exec(pushReport);
  return match?.groups?.url;
}
