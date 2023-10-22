import type { getBetterTTVGlobalEmotes } from "../BetterTTV.api";
import { BTTVCollection } from "./BetterTTVCollection";
import { BTTVEmote } from "./BetterTTVEmote";
import { BTTVSet } from "./BetterTTVSet";

export async function createBTTVGlobalCollection(
  bttvGlobalEmotes: Awaited<ReturnType<typeof getBetterTTVGlobalEmotes>>,
) {
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
  return new BTTVCollection("BetterTTV Global Emotes Collection", bttvSets);
}
