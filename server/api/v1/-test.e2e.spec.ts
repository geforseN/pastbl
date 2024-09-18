import { $fetch, setup } from "@nuxt/test-utils/e2e";
import { describe, it, expect } from "vitest";

describe("/api/v1", () => {
  describe("/test route", async () => {
    await setup({
      host: "http://127.0.0.1:3000",
    });
    it("should return 'Hello World!'", async () => {
      const html = await $fetch("/api/v1/test");
      expect(html).toBe("Hello World!");
    });
  });

  describe("/global-emotes-integrations route", async () => {
    await setup({
      host: "http://127.0.0.1:3000",
    });
    it("__query string", async () => {
      const html = await $fetch(
        "/api/v1/global-emotes-integrations?sources=Twitch",
      );
      expect(html).toBe("Hello World!");
    });
    it("__/all", async () => {
      const html = await $fetch(
        "/api/v1/global-emotes-integrations/all",
      );
      expect(html).toBe("Hello World!");
    });
    it("__param", async () => {
      const html = await $fetch(
        "/api/v1/global-emotes-integrations/Twitch",
      );
      expect(html).toBe("Hello World!");
    });
  });
});
