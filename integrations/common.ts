import type { EmoteSource } from ".";
import type { IEmoteIntegrationOwner, IEmoteSet } from "./abstract";

export function defineGlobalIntegrationMaker(source: EmoteSource) {
  return function <S extends IEmoteSet>(sets: S[]) {
    return {
      formedAt: Date.now(),
      sets,
      source,
      status: "ready" as const,
    };
  };
}

export function definePersonIntegrationMaker(source: EmoteSource) {
  return function <S extends IEmoteSet, O extends IEmoteIntegrationOwner>(
    sets: S[],
    owner: O,
  ) {
    return {
      formedAt: Date.now(),
      sets,
      source,
      status: "ready" as const,
      owner,
    };
  };
}

/*  */
export function defineEmoteSetMaker() {}
