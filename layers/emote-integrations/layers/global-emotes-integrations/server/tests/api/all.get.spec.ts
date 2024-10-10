import { describe, it, expect } from "vitest";
import { $apiFetch } from "~~/vitest/server-api/$apiFetch";

describe("GET /api/v1/global-emotes-integrations/all", () => {
  it("matches snapshot", async () => {
    const response = await $apiFetch("/global-emotes-integrations/all");

    response.integrations.FrankerFaceZ.sets = response.integrations.FrankerFaceZ.sets.map((set) => {
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
    });

    expect(response).toMatchSnapshot(
      {
        integrations: allEmoteSources.flatGroupBySource(() => ({
          formedAt: expect.any(Number),
        })),
      },
    );
  });
});
