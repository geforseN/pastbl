import type { IEmote } from "../../../../shared/abstract/types";

function makeSevenTVEmoteString(emote: IEmote) {
  return `<img data-token="${emote.token}" class="emote chat-pasta-emote" src="${emote.url}" alt="${emote.token}" loading="lazy" width="${emote.width}">`;
}

export function makeSevenTVWrappedEmoteString(emote: IEmote) {
  return `<span class="inline-block">${makeSevenTVEmoteString(emote)}</span>`;
}
