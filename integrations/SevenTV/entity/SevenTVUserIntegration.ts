import type { I7TVSet } from "./SevenTVSet";
import type { I7TVCollectionOwner } from "./SevenTVCollectionOwner";
import type { InternalUserEmoteIntegration } from "~/integrations";
import { raise } from "~/utils/error";

export interface ISevenTVUserIntegration
  extends InternalUserEmoteIntegration<
    "SevenTV",
    I7TVSet,
    I7TVCollectionOwner
  > {
  get activeSet(): I7TVSet;
}

export class SevenTVUserIntegration implements ISevenTVUserIntegration {
  name;
  sets;
  source;
  formedAt;
  owner;

  constructor(owner: I7TVCollectionOwner, sets: [I7TVSet]) {
    this.name = `${owner.displayName} Emotes`;
    this.sets = sets;
    this.source = "SevenTV" as const;
    this.formedAt = Date.now();
    this.owner = owner;
  }

  get activeSet() {
    return this.sets[0] || raise("SevenTV user collection has no active set");
  }
}
