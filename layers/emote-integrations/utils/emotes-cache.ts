
interface IMinimalEmote {
  token: string
}

export type EmotesMap<E extends IMinimalEmote> = Map<E["token"], E>;

export class EmotesCache<E extends IMinimalEmote> {
  readonly #cache: EmotesMap<E>;

  constructor() {
    this.#cache = new Map();
  }

  get(token: E["token"]) {
    return this.#cache.get(token);
  }

  set(emote: E) {
    this.#cache.set(emote.token, emote);
  }

  clear() {
    this.#cache.clear();
  }
}
