import { describe, it, expect } from "vitest";
import { $apiFetch } from "~~/vitest/server-api/$apiFetch";

describe("GET /api/v1/global-emotes-integrations/all", () => {
  it("matches snapshot", async () => {
    const response = await $apiFetch("/global-emotes-integrations/all");
    expect(response).toMatchSnapshot(
      {
        integrations: allEmoteSources.flatGroupBySource(() => ({
          formedAt: expect.any(Number),
        })),
      },
    );
  });
});
