export class EmoteContainer {
  constructor(private readonly element: HTMLImageElement) {}

  static from(target: HTMLImageElement) {
    assert.ok(target.classList.contains("emote"));
    return new EmoteContainer(target);
  }

  get emoteId() {
    const { emoteId } = this.element.dataset;
    assert.ok(isString(emoteId) && emoteId.length > 0);
    return emoteId;
  }
}

export function makeWrappedEmoteAsString(emote: IEmote) {
  if (emote.source === "SevenTV") {
    return makeSevenTVWrappedEmoteString(emote);
  }
  return `<span class="inline-block">${makeEmoteAsString(emote)}</span>`;
}

export function getEmoteToken(target: HTMLElement) {
  const { token } = target.dataset;
  assert.ok(typeof token === "string");
  return token;
}

export function isEmoteModifier(target: Element): target is HTMLElement {
  return (
    target instanceof HTMLElement && target.matches("[data-emote-modifier]")
  );
}

export function findEmoteWrapper(target: HTMLImageElement) {
  return target.closest("[data-emote-wrapper]");
}

export function getEmoteId(target: HTMLImageElement) {
  const { emoteId } = target.dataset;
  assert.ok(typeof emoteId === "string" && emoteId.length > 0);
  return emoteId;
}

function makeEmoteAsString(
  emote: IEmote,
  getAlt = (emote: IEmote) => emote.token,
) {
  const width = "width" in emote ? emote.width : "";
  const height = "height" in emote ? emote.height : "";
  return `<img data-token="${emote.token}" class="emote chat-pasta-emote" src="${emote.url}" alt="${getAlt(emote)}" loading="lazy" width="${width}" height="${height}">`;
}

function makeModifierEmoteAsString(modifierEmote: IEmote) {
  const style
    = "pointer-events: none; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)";
  return `<span data-emote-modifier data-token="${modifierEmote.token}" style="${style}">${makeEmoteAsString(modifierEmote, (emote) => " " + emote.token)}</span>`;
}

export function makeEmoteAsStringWithModifiersWrapper(
  emote: IEmote,
  modifierEmotes: IEmote[],
) {
  const emoteAsString = makeWrappedEmoteAsString(emote);
  const modifiersAsString = modifierEmotes
    .map(makeModifierEmoteAsString)
    .join(" ");
  return `<figure data-emote-wrapper style="display: inline-block; position: relative;">${emoteAsString}${modifiersAsString}</figure>`;
}
