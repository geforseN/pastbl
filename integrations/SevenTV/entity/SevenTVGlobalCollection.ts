import type { I7TVSet } from "./SevenTVSet";
import type { InternalGlobalEmoteCollection } from "~/integrations";

export interface I7TVGlobalCollection
  extends InternalGlobalEmoteCollection<"SevenTV", I7TVSet> {}

export class SevenTVGlobalCollection implements I7TVGlobalCollection {
  name;
  sets;
  source;
  updatedAt;

  constructor(sets: I7TVSet[]) {
    this.name = "SevenTV Global Emotes Collection" as const;
    this.sets = sets;
    this.source = "SevenTV" as const;
    this.updatedAt = Date.now();
  }
}
