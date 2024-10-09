import { describe, it, expect } from "vitest";
import { $apiFetch } from "~~/vitest/server-api/$apiFetch";

describe("GET /api/v1/global-emotes-integrations", () => {
  it.todo("query empty");
  it.todo("query with all emotes sources");
  it.todo("query with invalid only");
  it.todo("query with invalid and valid");

  it.todo.for([...allEmoteSources])("matches snapshot", async (source) => {
    const response = await $apiFetch("/global-emotes-integrations/" + source);
    expect(response).toMatchSnapshot(
      {
        integration: allEmoteSources.flatGroupBySource(() => ({
          formedAt: expect.any(Number),
        })),
      },
    );
  });
});
