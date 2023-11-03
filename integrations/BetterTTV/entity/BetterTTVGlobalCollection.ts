import type { BetterTTVSet } from "./BetterTTVSet";
import type { IGlobalEmoteCollection } from "~/integrations";

export interface BetterTTVGlobalCollection
  extends IGlobalEmoteCollection<"BetterTTV", BetterTTVSet> {}

export class BTTVGlobalCollection implements BetterTTVGlobalCollection {
  name;
  sets;
  source;
  updatedAt;

  constructor(sets: BetterTTVSet[]) {
    this.name = "BetterTTV Global Emotes Collection" as const;
    this.sets = sets;
    this.source = "BetterTTV" as const;
    this.updatedAt = Date.now();
  }
}
