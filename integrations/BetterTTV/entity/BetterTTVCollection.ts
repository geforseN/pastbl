import type { EmoteCollection } from "~/integrations";
import type { BetterTTVSet } from "./BetterTTVSet";

export interface BetterTTVCollection extends EmoteCollection<BetterTTVSet> {
  source: "BetterTTV";
}

export class BTTVCollection {
  name;
  sets;
  source;
  updatedAt;

  constructor(name: string, sets: BetterTTVSet[]) {
    this.name = name;
    this.sets = sets;
    this.source = "BetterTTV";
    this.updatedAt = Date.now();
  }
}
