import type { IBetterTTVApi } from "../api";
import {
  BTTVGlobalCollection,
  type BetterTTVGlobalCollection,
} from "./BetterTTVGlobalCollection";
import { BTTVEmote } from "./BetterTTVEmote";
import { BetterTTVSet } from "./BetterTTVSet";

export function createBTTVGlobalCollection(
  bttvGlobalEmotes: IBetterTTVApi["Global"]["Emote"][],
): BetterTTVGlobalCollection {
  const bttvSet = new BetterTTVSet(
    bttvGlobalEmotes.map((emote) => new BTTVEmote(emote, "global")),
    "bttv::global",
    "Global emotes",
  );
  return new BTTVGlobalCollection([bttvSet]);
}
