import { describe, it, expect } from "vitest";
import { objectOmit } from "@vueuse/core";
import {
  integrationWithAnyFormedAtNumber,
  makeShortFrankerFaceZGlobalSet,
} from "./utils";
import { $apiFetch } from "#tests-nitro-api-fetch";

describe("GET /api/v1/global-emotes-integrations", () => {
  describe("when no query", async () => {
    const response = await $apiFetch.raw("/global-emotes-integrations", {
      ignoreResponseError: true,
    });
    it("will be not ok and 400", () => {
      expect(response.status).toBe(400);
      expect(response.ok).toBe(false);
    });
    it("will contain error message", () => {
      expect(response._data.data.message).toMatchSnapshot();
    });
  });

  describe("query with all emotes sources", async () => {
    const response = await $apiFetch.raw("/global-emotes-integrations", {
      query: { sources: allEmoteSources.join("+") },
    });

    it("will be ok and 200", () => {
      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);
    });

    describe("response._data", () => {
      for (const integration of Object.values(response._data.integrations)) {
        expect(Number.isFinite(integration.formedAt)).toBe(true);
        integration.formedAt = expect.any(Number);
      }

      const { FrankerFaceZ } = response._data.integrations;
      FrankerFaceZ.sets = FrankerFaceZ.sets.map(makeShortFrankerFaceZGlobalSet);

      it("matches integrations snapshot", () => {
        expect(response._data.integrations).toMatchSnapshot();
      });
    });
  });

  describe("query with invalid only", async () => {
    const response = await $apiFetch.raw("/global-emotes-integrations", {
      query: { sources: "invalid" },
      ignoreResponseError: true,
    });

    it("will be not ok and 400", async () => {
      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
    });

    describe("response._data", () => {
      it("is object", () => {
        expect(response._data).toBeTypeOf("object");
      });

      it("will match snapshot", () => {
        expect(objectOmit(response._data, ["stack"])).toMatchSnapshot();
      });
    });
  });

  describe("query with invalid and valid", () => {
    describe("invalid+FrankerFaceZ", async () => {
      const response = await $apiFetch.raw("/global-emotes-integrations", {
        query: { sources: "invalid+FrankerFaceZ" },
      });

      it("will be ok and 200", async () => {
        expect(response.ok).toBe(true);
        expect(response.status).toBe(200);
      });

      it("will contained only valid source, invalid will be filtered out", () => {
        const ffz = response._data.integrations.FrankerFaceZ;
        if ("sets" in ffz && isArray(ffz.sets)) {
          ffz.sets = ffz.sets.map(makeShortFrankerFaceZGlobalSet);
        }

        expect(response._data).toMatchSnapshot({
          integrations: {
            FrankerFaceZ: integrationWithAnyFormedAtNumber,
          },
        });
      });
    });

    describe("invalid+frankerFacez", async () => {
      const response = await $apiFetch.raw("/global-emotes-integrations", {
        query: { sources: "invalid+frankerFacez" },
        ignoreResponseError: true,
      });

      it("will be not ok and 400", async () => {
        expect(response.ok).toBe(false);
        expect(response.status).toBe(400);
      });

      describe("response._data", () => {
        it("is object", () => {
          expect(response._data).toBeTypeOf("object");
        });

        it("will match snapshot", () => {
          expect(objectOmit(response._data, ["stack"])).toMatchSnapshot();
        });
      });
    });
  });
});
