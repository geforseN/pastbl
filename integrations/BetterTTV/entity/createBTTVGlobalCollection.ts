import type { getBetterTTVGlobalEmotes } from "../BetterTTV.api";
import {
  BTTVGlobalCollection,
  type BetterTTVGlobalCollection,
} from "./BetterTTVGlobalCollection";
import { BTTVEmote } from "./BetterTTVEmote";
import { BTTVSet } from "./BetterTTVSet";

export function createBTTVGlobalCollection(
  bttvGlobalEmotes: Awaited<ReturnType<typeof getBetterTTVGlobalEmotes>>,
): BetterTTVGlobalCollection {
  const bttvSets = [
    new BTTVSet(
      {
        emotes: bttvGlobalEmotes,
        name: "Global BetterTTV emotes",
        id: "bttv::global",
      },
      (emote) => new BTTVEmote(emote, "global"),
    ),
  ];
  return new BTTVGlobalCollection(bttvSets);
}
