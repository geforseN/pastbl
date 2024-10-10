import { describe, it, expect } from "vitest";
import { integrationWithAnyFormedAtNumber, makeShortFrankerFaceZGlobalSet } from "./utils";
import { $apiFetch } from "~~/vitest/server-api/$apiFetch";

describe("GET /api/v1/global-emotes-integrations/[maybe-source]", () => {
  // FIXME
  // FIXME
  // FIXME
  it.todo.for([...allEmoteSources])("%s matches snapshot", async (source) => {
    const response = await $apiFetch("/global-emotes-integrations/" + source);
    if (source === "FrankerFaceZ") {
      response.integration.sets = response.integration.sets.map(makeShortFrankerFaceZGlobalSet);
    }
    expect(response).toMatchSnapshot({
      integration: integrationWithAnyFormedAtNumber,
    });
  });

  describe("404 on unknown non emote source param", async () => {
    const response = await $apiFetch.raw("/global-emotes-integrations/unknown", {
      ignoreResponseError: true,
    });

    it("will be not ok", () => {
      expect(response.ok).toBe(false);
    });

    it("will not be 400, but 404", () => {
      expect(response.status).not.toBe(400);
      expect(response.status).toBe(404);
    });

    it.todo("data will contain error message");
  });
});
