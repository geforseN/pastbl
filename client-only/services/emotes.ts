import { idb } from "../IndexedDB";
import type { EmoteSource, IEmote } from "~/integrations";

export const emotesIDB = {
  async put(emotes: IEmote[]) {
    return (await idb.emotes).put(emotes);
  },
  async makeDeleteEmotesFn(source: EmoteSource) {
    return (await idb.emotes).deleteManyWithSource(source);
  },
  async makeEmoteGetter(source: EmoteSource) {
    return (await idb.emotes).getWithSource(source);
  },
  async getEmote(source: EmoteSource, emoteId: string) {
    return (await idb.emotes).getWithSource(source)(emoteId);
  },
  get emotesTransaction() {
    return idb.emotes.then((idb) => idb.emotesTransaction);
  },
};
