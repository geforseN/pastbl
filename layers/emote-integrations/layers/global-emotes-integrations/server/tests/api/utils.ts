import { expect } from "vitest";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function makeShortFrankerFaceZGlobalSet(set: any) {
  if (set.allowedTo) {
    assert.ok(
      Array.isArray(set.allowedTo.twitchIds)
      && set.allowedTo.twitchIds.every(Number.isInteger),
    );
    return {
      ...set,
      allowedTo: {
        twitchIds: "IntegersArray",
      },
    };
  }
  return set;
}

export const integrationWithAnyFormedAtNumber = {
  formedAt: expect.any(Number),
};
