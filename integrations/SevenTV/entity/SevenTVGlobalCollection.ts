import type { I7TVSet } from "./SevenTVSet";
import type { InternalGlobalEmoteCollection } from "~/integrations";

export interface I7TVGlobalCollection
  extends InternalGlobalEmoteCollection<"SevenTV", I7TVSet> {}

export class SevenTVGlobalCollection implements I7TVGlobalCollection {
  name = "SevenTV Global Emotes Collection" as const;
  sets;
  source = "SevenTV" as const;
  formedAt = Date.now();

  constructor(sets: I7TVSet[]) {
    this.sets = sets;
  }
}
