import type { IEmote } from "..";

function SevenTVEmoteString(emote: IEmote) {
  return `<img data-token="${emote.token}" class="emote" src="${emote.url}" alt="${emote.token}" loading="lazy" width="${emote.width}">`;
}

export function SevenTVWrappedEmoteString(emote: IEmote) {
  return `<span class="inline-block">${SevenTVEmoteString(emote)}</span>`;
}
