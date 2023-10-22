import type { EmoteSet } from "~/integrations";
import type { BTTVEmote, BetterTTVEmote } from "./BetterTTVEmote";
import type { BetterTTVApiEmote } from "../BetterTTV.api";

export interface BetterTTVSet extends EmoteSet<BetterTTVEmote> {
  source: "BetterTTV";
}

export class BTTVSet implements BetterTTVSet {
  emotes;
  id;
  name;
  source;
  updatedAt;

  constructor(
    bttvSetData: { name: string; emotes: BetterTTVApiEmote[]; id: string },
    toBTTVEmoteCallback: (value: BetterTTVApiEmote) => BTTVEmote,
  ) {
    this.id = bttvSetData.id;
    this.name = bttvSetData.name;
    this.emotes = bttvSetData.emotes.map(toBTTVEmoteCallback);
    this.source = "BetterTTV" as const;
    this.updatedAt = Date.now();
  }
}
