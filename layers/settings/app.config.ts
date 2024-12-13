import { defineAppConfig } from "#app/nuxt";

export const settingsConfig = {
  badges: {
    count: {
      min: 0,
      max: 10,
    },
  },
  nickname: {
    length: {
      min: 3,
      max: 32,
    },
  },
} as const;

export default defineAppConfig({ ...structuredClone(settingsConfig) });
