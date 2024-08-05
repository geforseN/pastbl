import type { TEmoteIntegrations } from "$/emote-integrations";

export function definePersonEmoteIntegrationMaker<
  I extends TEmoteIntegrations.Person.Ready,
>(source: I["source"]) {
  return function (sets: I["sets"], owner: I["owner"]) {
    return <I>{
      formedAt: Date.now(),
      sets,
      source,
      status: "ready" as const,
      owner,
    };
  };
}
