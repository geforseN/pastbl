import type { IBetterTTVEmote } from "./BetterTTVEmote";
import type { IEmoteSet } from "~/integrations";

export interface IBetterTTVSet extends IEmoteSet<"BetterTTV", IBetterTTVEmote> {
  source: "BetterTTV";
}

export class BetterTTVSet implements IBetterTTVSet {
  emotes: IBetterTTVEmote[];
  id: string;
  name: string;
  source = "BetterTTV" as const;
  updatedAt = Date.now();

  constructor(emotes: IBetterTTVEmote[], id: string, name: string) {
    this.emotes = emotes;
    this.id = id;
    this.name = name;
  }
}
