import type { I7TVSet } from "./SevenTVSet";
import type { EmoteCollection } from "~/integrations";

export interface I7TVGlobalCollection extends EmoteCollection<I7TVSet> {
  source: "SevenTV";
}

export class SevenTVGlobalCollection implements I7TVGlobalCollection {
  name;
  sets;
  source;
  updatedAt;

  constructor(sets: I7TVSet[]) {
    this.name = "SevenTV Global Emotes Collection";
    this.sets = sets;
    this.source = "SevenTV" as const;
    this.updatedAt = Date.now();
  }
}
