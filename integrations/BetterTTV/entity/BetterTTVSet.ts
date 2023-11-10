import type { BetterTTVApiEmote } from "../BetterTTV.api";
import type { BTTVEmote, BetterTTVEmote } from "./BetterTTVEmote";
import type { IEmoteSet } from "~/integrations";

export interface BetterTTVSet extends IEmoteSet<BetterTTVEmote> {
  source: "BetterTTV";
}

export class BTTVSet implements BetterTTVSet {
  emotes;
  id;
  isActive;
  name;
  source;
  updatedAt;

  constructor(
    apiSetData: { name: string; emotes: BetterTTVApiEmote[]; id: string },
    toBTTVEmoteCallback: (value: BetterTTVApiEmote) => BTTVEmote,
  ) {
    this.emotes = apiSetData.emotes.map(toBTTVEmoteCallback);
    this.id = apiSetData.id;
    this.isActive = true;
    this.name = apiSetData.name;
    this.source = "BetterTTV" as const;
    this.updatedAt = Date.now();
  }
}
