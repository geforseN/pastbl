import type { EmoteCollection } from "~/integrations";
import type { I7TVSet } from "./SevenTVSet";

export interface I7TVCollection extends EmoteCollection<I7TVSet> {
  source: "SevenTV";
}

export class SevenTVCollection implements I7TVCollection {
  name;
  sets;
  source;
  updatedAt;

  constructor(name: string, sets: I7TVSet[]) {
    this.name = name;
    this.sets = sets;
    this.source = "SevenTV" as const;
    this.updatedAt = Date.now();
  }
}
