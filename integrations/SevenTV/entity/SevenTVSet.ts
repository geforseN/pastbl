import type { SevenTVApiEmoteSet, SevenTVApiSetEmote } from "../SevenTV.api";
import type { I7TVEmote } from "./SevenTVEmote";
import type { IEmoteSet } from "~/integrations";

export interface I7TVSet extends IEmoteSet<I7TVEmote> {
  source: "SevenTV";
  capacity: number;
  isValid: boolean;
}

export class SevenTVSet implements I7TVSet {
  capacity;
  emotes;
  id;
  isActive;
  readonly isValid;
  name;
  source;
  updatedAt;

  constructor(
    apiSet: SevenTVApiEmoteSet<true | false>,
    to7TVEmoteCallback: (value: SevenTVApiSetEmote) => I7TVEmote,
  ) {
    this.capacity = apiSet.capacity;
    this.emotes = (apiSet.emotes || []).map(to7TVEmoteCallback);
    this.id = apiSet.id;
    this.isActive = true;
    this.isValid = "emotes" in apiSet;
    this.name = apiSet.name;
    this.source = "SevenTV" as const;
    this.updatedAt = Date.now();
  }
}
