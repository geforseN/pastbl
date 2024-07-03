import { idb } from "../../../app/client-only/IndexedDB";
import type { IEmote, EmoteSource } from "~/integrations";

function withStore<T>(callback: (store: Awaited<typeof idb.emotes>) => T) {
  return idb.emotes.then((idb) => callback(idb));
}

export const emotesIDB = {
  async put(emotes: IEmote[]) {
    return withStore((store) => store.put(emotes));
  },
  async makeDeleteEmotesFn(source: EmoteSource) {
    return withStore((store) => store.deleteManyWithSource(source));
  },
  async makeEmoteGetter(source: EmoteSource) {
    return withStore((store) => store.getWithSource(source));
  },
  async getEmote(source: EmoteSource, emoteId: string) {
    return withStore((store) => store.getWithSource(source)(emoteId));
  },
  get emotesTransaction() {
    return withStore((store) => store.emotesTransaction);
  },
};
