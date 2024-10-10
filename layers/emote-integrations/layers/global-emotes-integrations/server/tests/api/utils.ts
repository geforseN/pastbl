import { expect } from "vitest";

export function makeShortFrankerFaceZGlobalSet(set) {
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
};

export const integrationWithAnyFormedAtNumber = {
  formedAt: expect.any(Number),
};
