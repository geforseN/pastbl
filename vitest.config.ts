import { defineVitestConfig } from "@nuxt/test-utils/config";

export default defineVitestConfig({
  test: {
    include: [
      "layers/emote-integrations/utils/emotes.nuxt.spec.ts",
      "app/utils/guard.nuxt.spec.ts",
    ],
  },
});
