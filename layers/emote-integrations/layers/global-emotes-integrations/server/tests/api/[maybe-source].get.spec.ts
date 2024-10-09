import { describe, it, expect } from "vitest";
import { $apiFetch } from "~~/vitest/server-api/$apiFetch";

describe("GET /api/v1/global-emotes-integrations/[maybe-source]", () => {
  it.todo.for([...allEmoteSources])("%s matches snapshot", async (source) => {
    const response = await $apiFetch("/global-emotes-integrations/" + source);
    expect(response).toMatchSnapshot(
      {
        integrations: allEmoteSources.flatGroupBySource(() => ({
          formedAt: expect.any(Number),
        })),
      },
    );
  });

  it("404 on unknown non emote source param", async () => {
    expect(
      async () => await $apiFetch(
        "/global-emotes-integrations/unknown",
      ),
    ).rejects.toThrow(/404/);
  });
});
