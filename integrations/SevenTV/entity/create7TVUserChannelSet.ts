import type { SevenTVApiEmoteSet } from "../SevenTV.api";
import { SevenTVEmote } from "./SevenTVEmote";
import { SevenTVSet, type I7TVSet } from "./SevenTVSet";

export function create7TVUserChannelSet(
  apiSet: SevenTVApiEmoteSet<true | false>,
): Readonly<I7TVSet> {
  return makeObjectFrozen(
    new SevenTVSet(apiSet, (emote) => new SevenTVEmote(emote, "channel")),
  );
}
