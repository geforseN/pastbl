import type { I7TVEmote } from "./entity/SevenTVEmote";

export function SevenTVEmoteString(emote: I7TVEmote) {
  return `<span class="inline-block" title="${emote.token} emote from SevenTV ${
    emote.originalName ? `(aka ${emote.originalName})` : ""
  }">
<img src="https:${emote.url}/1x.webp">
</span>`;
}

export type { I7TVSet } from "./entity/SevenTVSet";
export { create7TVGlobalCollection } from "./entity/create7TVGlobalCollection";
export { create7TVUserChannelSet } from "./entity/create7TVUserChannelSet";
export { create7TVUserCollection } from "./entity/create7TVUserCollection";
