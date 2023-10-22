import type { BetterTTVEmote } from "./entity/BetterTTVEmote";

export function BTTVEmoteString(emote: BetterTTVEmote) {
  return `<span class="inline-block" title="${emote.token} emote from BetterTTV"><img src="https:${emote.url}/1x.webp"></span>`;
}
