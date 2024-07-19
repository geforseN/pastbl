export class EmotesService_____ {
  constructor(private readonly emotesStorePromise: any) {}

  #withStore<T>(callback: (store: Awaited<typeof idb.emotes>) => T) {
    return this.emotesStorePromise.then((database) => callback(database));
  }

  async put(emotes: IEmote[]) {
    return this.#withStore((store) => store.put(emotes));
  }

  async makeDeleteEmotesFn(source: EmoteSource) {
    return this.#withStore((store) => store.deleteManyWithSource(source));
  }

  async makeEmoteGetter(source: EmoteSource) {
    return this.#withStore((store) => store.getWithSource(source));
  }

  async getEmote(source: EmoteSource, emoteId: string) {
    return this.#withStore((store) => store.getWithSource(source)(emoteId));
  }

  get emotesTransaction() {
    return this.#withStore((store) => store.emotesTransaction);
  }
}
