import { describe, it, expect } from "vitest";
import { integrationWithAnyFormedAtNumber, makeShortFrankerFaceZGlobalSet } from "./utils";
import { $apiFetch } from "~~/vitest/server-api/$apiFetch";

describe("GET /api/v1/global-emotes-integrations/[maybe-source]", () => {
  describe("valid emote source is provided", () => {
    it.for([...allEmoteSources])("%s matches snapshot", async (source) => {
      const response = await $apiFetch("/global-emotes-integrations/" + source);
      if (source === "FrankerFaceZ") {
        response.integration.sets = response.integration.sets.map(makeShortFrankerFaceZGlobalSet);
      }
      expect(response).toMatchSnapshot({
        integration: integrationWithAnyFormedAtNumber,
      });
    });
  });

  describe("emote source is provided, but string case is different", () => {
    it.for(allEmoteSources.map(toLowerCase))("%s param is valid", async (lowercasedSource) => {
      const source = allEmoteSources.find((source) => source.toLowerCase() === lowercasedSource);
      expect(source).toBeTypeOf("string");
      const response = await $apiFetch("/global-emotes-integrations/" + lowercasedSource);
      expect(response).toEqual({
        integration: {
          source,
          status: "ready",
          sets: expect.any(Array),
          formedAt: expect.any(Number),
        },
      });
    });
  });

  describe("invalid param", () => {
    describe("unknown", async () => {
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

      describe("_data", () => {
        it("will match snapshot", () => {
          expect(response._data).toMatchSnapshot();
        });
      });
    });

    describe("BetterTTV/FrankerFaceZ", async () => {
      const response = await $apiFetch.raw("/global-emotes-integrations/BetterTTV/FrankerFaceZ", {
        ignoreResponseError: true,
      });

      it("will be not ok", () => {
        expect(response.ok).toBe(false);
      });

      it("will not be 400, but 404", () => {
        expect(response.status).not.toBe(400);
        expect(response.status).toBe(404);
      });

      describe("_data", () => {
        it("will match snapshot", () => {
          expect(response._data).toMatchSnapshot();
        });
      });
    });
  });
});
