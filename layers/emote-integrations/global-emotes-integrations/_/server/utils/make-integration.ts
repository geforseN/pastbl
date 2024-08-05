import type { TEmoteIntegrations } from "$/emote-integrations";

export function defineGlobalIntegrationMaker<
  I extends TEmoteIntegrations.Global.Ready,
>(source: I["source"]) {
  return function (sets: I["sets"]) {
    return <I>{
      formedAt: Date.now(),
      sets,
      source,
      status: "ready" as const,
    };
  };
}
