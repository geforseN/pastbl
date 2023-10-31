import type { SevenTVApiEmoteSet, SevenTVApiSetEmote } from "../SevenTV.api";
import type { I7TVEmote } from "./SevenTVEmote";
import type { EmoteSet } from "~/integrations";

export interface I7TVSet extends EmoteSet {
  emotes: I7TVEmote[];
  source: "SevenTV";
  name: string;
  capacity: number;
  id: string;
  isValid: boolean;
}

export class SevenTVSet implements I7TVSet {
  updatedAt;
  source;
  emotes;
  readonly isValid;
  name;
  capacity;
  id;

  constructor(
    apiSet: SevenTVApiEmoteSet<true | false>,
    to7TVEmoteCallback: (_value: SevenTVApiSetEmote) => I7TVEmote,
  ) {
    this.id = apiSet.id;
    this.name = apiSet.name;
    this.isValid = "emotes" in apiSet;
    this.emotes = (apiSet.emotes || []).map(to7TVEmoteCallback);
    this.source = "SevenTV" as const;
    this.updatedAt = Date.now();
    this.capacity = apiSet.capacity;
  }
}
