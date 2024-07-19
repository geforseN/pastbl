import type { TEmoteIntegrations } from "./EmoteIntegration";

export interface HasSource {
  source: EmoteSource;
}

export interface HasFormedAt {
  formedAt: number;
}

export function defineGlobalIntegrationMaker<
  I extends TEmoteIntegrations.Global.Ready,
>(source: I["source"]) {
  return function (sets: I["sets"]) {
    return {
      formedAt: Date.now(),
      sets,
      source,
      status: "ready" as const,
    } as I;
  };
}

export function definePersonIntegrationMaker<
  I extends TEmoteIntegrations.Person.Ready,
>(source: I["source"]) {
  return function (sets: I["sets"], owner: I["owner"]) {
    return {
      formedAt: Date.now(),
      sets,
      source,
      status: "ready" as const,
      owner,
    } as I;
  };
}

export function defineEmoteSetMaker() {
  /*  */
}
