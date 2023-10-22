import type { sevenTVApi } from "../SevenTV.api";
import { SevenTVCollection, type I7TVCollection } from "./SevenTVCollection";
import { SevenTVEmote } from "./SevenTVEmote";
import { SevenTVSet } from "./SevenTVSet";

export async function create7TVGlobalCollection(
  sets: Awaited<ReturnType<(typeof sevenTVApi)["getEmoteSetById"]>>[],
): Promise<I7TVCollection> {
  const sevenTVSets = sets
    .filter((set) => set.emotes?.length)
    .map((set) => {
      return new SevenTVSet(set, (emote) => new SevenTVEmote(emote, "global"));
    });
  return new SevenTVCollection("SevenTV Global Emotes Collection", sevenTVSets);
}
