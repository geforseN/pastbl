import { describe, it, expect } from "vitest";
import {
  integrationWithAnyFormedAtNumber,
  makeShortFrankerFaceZGlobalSet,
} from "./utils";
import { $apiFetch } from "#tests-nitro-api-fetch";

describe("GET /api/v1/global-emotes-integrations/all", () => {
  it("matches snapshot", async () => {
    const response = await $apiFetch("/global-emotes-integrations/all");

    const ffz = response.integrations.FrankerFaceZ;
    if ("sets" in ffz && isArray(ffz.sets)) {
      ffz.sets = ffz.sets.map(makeShortFrankerFaceZGlobalSet);
    }

    expect(response.integrations).toMatchSnapshot(
      allEmoteSources.flatGroupBySource(() => integrationWithAnyFormedAtNumber),
    );
  });
});
