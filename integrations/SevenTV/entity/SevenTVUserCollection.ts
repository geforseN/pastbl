import type { I7TVSet } from "./SevenTVSet";
import type { I7TVCollection } from "./SevenTVCollection";
import type { I7TVCollectionOwner } from "./SevenTVCollectionOwner";

export interface I7TVUserCollection extends I7TVCollection {
  owner: I7TVCollectionOwner;
}

export class SevenTVUserCollection implements I7TVUserCollection {
  name;
  sets;
  source;
  updatedAt;
  owner;

  constructor(sets: I7TVSet[], owner: I7TVCollectionOwner) {
    this.name = `SevenTV ${owner.displayName} Emotes Collection`;
    this.sets = sets;
    this.source = "SevenTV" as const;
    this.updatedAt = Date.now();
    this.owner = owner;
  }
}
