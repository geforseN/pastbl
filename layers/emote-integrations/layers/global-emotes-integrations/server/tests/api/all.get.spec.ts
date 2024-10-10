import { describe, it, expect } from "vitest";
import {
  integrationWithAnyFormedAtNumber,
  makeShortFrankerFaceZGlobalSet,
} from "./utils";
import { $apiFetch } from "~~/vitest/server-api/$apiFetch";

describe("GET /api/v1/global-emotes-integrations/all", () => {
  it("matches snapshot", async () => {
    const response = await $apiFetch("/global-emotes-integrations/all");

    response.integrations.FrankerFaceZ.sets
      = response.integrations.FrankerFaceZ.sets.map(
        makeShortFrankerFaceZGlobalSet,
      );

    expect(response).toMatchSnapshot({
      integrations: allEmoteSources.flatGroupBySource(
        () => integrationWithAnyFormedAtNumber,
      ),
    });
  });
});
