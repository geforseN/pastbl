import type { IEmote } from "~/integrations";

export type EmotesMap = Map<IEmote["token"], IEmote>;

export class EmotesCache {
  readonly #cache: EmotesMap;

  constructor() {
    this.#cache = new Map();
  }

  get(token: IEmote["token"]) {
    return this.#cache.get(token);
  }

  set(emote: IEmote) {
    this.#cache.set(emote.token, emote);
  }

  clear() {
    this.#cache.clear();
  }
}
