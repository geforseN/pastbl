import type { IBetterTTVSet } from "./BetterTTVSet";
import type { InternalGlobalEmoteCollection } from "~/integrations";

export interface BetterTTVGlobalCollection
  extends InternalGlobalEmoteCollection<"BetterTTV", IBetterTTVSet> {}

export class BTTVGlobalCollection implements BetterTTVGlobalCollection {
  name = "BetterTTV Global Emotes Collection" as const;
  sets;
  source = "BetterTTV" as const;
  updatedAt = Date.now();

  constructor(sets: IBetterTTVSet[]) {
    this.sets = sets;
  }
}
