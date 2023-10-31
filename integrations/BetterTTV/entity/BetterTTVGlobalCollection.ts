import type { BetterTTVSet } from "./BetterTTVSet";
import type { EmoteCollection } from "~/integrations";

export interface BetterTTVGlobalCollection
  extends EmoteCollection<BetterTTVSet> {
  name: "BetterTTV Global Emotes Collection";
  source: "BetterTTV";
}

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
