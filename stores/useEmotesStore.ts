import { defineStore } from "pinia";
import type { AvailableEmoteSource, IEmote } from "~/integrations";

export const useEmotesStore = defineStore("emotes", () => {
  const users: Record<AvailableEmoteSource, Map<IEmote["id"], IEmote>> = {
    BetterTTV: new Map(),
    FrankerFaceZ: new Map(),
    SevenTV: new Map(),
  };
  const global: Record<AvailableEmoteSource, Map<IEmote["id"], IEmote>> = {
    BetterTTV: new Map(),
    FrankerFaceZ: new Map(),
    SevenTV: new Map(),
  };

  return {
    users,
    global,
  };
});
