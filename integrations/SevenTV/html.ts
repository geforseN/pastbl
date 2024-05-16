import type { ISevenTVEmote } from ".";

function SevenTVEmoteString(emote: ISevenTVEmote) {
  return `<img data-token="${emote.token}" class="emote" src="${emote.url}" alt="${emote.token}" loading="lazy" width="${emote.width}">`;
}

export function SevenTVWrappedEmoteString(emote: ISevenTVEmote) {
  return `<span class="inline-block">${SevenTVEmoteString(emote)}</span>`;
}
