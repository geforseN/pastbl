import type { get7TVGlobalEmotesSet } from "../SevenTV.api";
import {
  SevenTVGlobalCollection,
  type I7TVGlobalCollection,
} from "./SevenTVGlobalCollection";
import { SevenTVEmote } from "./SevenTVEmote";
import { SevenTVSet } from "./SevenTVSet";

export function create7TVGlobalCollection(
  sets: Awaited<ReturnType<typeof get7TVGlobalEmotesSet>>[],
): I7TVGlobalCollection {
  const sevenTVSets = sets
    .filter((set) => set.emotes?.length)
    .map((set) => {
      return new SevenTVSet(set, (emote) => new SevenTVEmote(emote, "global"));
    });
  return new SevenTVGlobalCollection(sevenTVSets);
}
