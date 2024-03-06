import { idb } from "../IndexedDB";
import type { EmoteSource, IEmote } from "~/integrations";

export const emotesIDB = {
  async put(emotes: IEmote[]) {
    return (await idb.emotes).put(emotes);
  },

  async makeDeleteEmotesFn(source: EmoteSource) {
    return (await idb.emotes).deleteManyWithSource(source);
  },

  get emotesTransaction() {
    return idb.emotes.then((idb) => idb.emotesTransaction);
  },
};
