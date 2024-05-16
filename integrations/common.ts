import type { EmoteSource } from ".";

export function defineGlobalIntegrationMaker(source: EmoteSource) {
  return function (sets: any[]) {
    return {
      formedAt: Date.now(),
      sets,
      source,
      status: "ready" as const,
    };
  };
}

export function definePersonIntegrationMaker(source: EmoteSource) {
  return function (sets: any[], owner: object) {
    return {
      formedAt: Date.now(),
      sets,
      source,
      status: "ready" as const,
      owner,
    };
  };
}

export function defineEmoteSetMaker() {}
