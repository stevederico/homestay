/**
 * HTTP status the backend answers when a free user has spent the free tier
 * and the route needs the Premium Host plan.
 */
export const UPGRADE_REQUIRED_STATUS = 402;

/**
 * Whether a failed `apiRequest` call was refused for lack of a subscription.
 *
 * skateboard-ui's `apiRequest` drops the response body on non-OK statuses and
 * throws `Request failed: <status> <statusText>`, so the status in the
 * message is the only signal that reaches the caller.
 *
 * @param error - Value caught from `apiRequest`
 * @returns True when the request failed with HTTP 402
 */
export function isUpgradeRequired(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return new RegExp(`^Request failed: ${UPGRADE_REQUIRED_STATUS}\\b`).test(error.message);
}
