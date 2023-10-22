import type { I7TVEmote } from "./entity/SevenTVEmote";

class SevenTV {
  shouldLog = false;

  getEmoteTemplateString(emote: I7TVEmote) {
    return `<span class="inline-block" title="${
      emote.token
    } emote from SevenTV ${
      emote.originalName ? `(aka ${emote.originalName})` : ""
    }">
<img src="https:${emote.url}/1x.webp">
</span>
  `;
  }
}

export const sevenTV = new SevenTV();
export { create7TVGlobalCollection } from "./entity/create7TVGlobalCollection";
