import type { SevenTVApiEmoteSet } from "../SevenTV.api";
import { SevenTVEmote } from "./SevenTVEmote";
import { SevenTVSet } from "./SevenTVSet";

export function create7TVUserChannelSet(apiSet: Required<SevenTVApiEmoteSet>) {
  return new SevenTVSet(apiSet, (emote) => new SevenTVEmote(emote, "channel"));
}
