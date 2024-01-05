import type { I7TVEmote } from "./entity/SevenTVEmote";

function getSevenTVEmoteTitle(emote: I7TVEmote) {
  return `${emote.token} emote from SevenTV`;
}

export function SevenTVEmoteString(emote: I7TVEmote) {
  return `<img src="https:${emote.url}/1x.webp" alt="${getSevenTVEmoteTitle(
    emote,
  )}" loading="lazy" width="${emote.width}">`;
}

export function SevenTVWrappedEmoteString(emote: I7TVEmote) {
  const aka = emote.originalName ? ` (aka ${emote.originalName})` : "";
  return `<span class="inline-block" title="${getSevenTVEmoteTitle(
    emote,
  )}${aka}">${SevenTVEmoteString(emote)}</span>`;
}

export type { I7TVGlobalCollection } from "./entity/SevenTVGlobalCollection";
export type { I7TVUserCollection } from "./entity/SevenTVUserIntegration";
export type { I7TVSet } from "./entity/SevenTVSet";
export type { I7TVEmote } from "./entity/SevenTVEmote";
export { create7TVGlobalCollection } from "./entity/create7TVGlobalCollection";
export { create7TVUserChannelSet } from "./entity/create7TVUserChannelSet";
export { create7TVUserIntegration } from "./entity/create7TVUserIntegration";
export { recreate7TVUserIntegration } from "./entity/recreate7TVUserIntegration";
