import type { EmoteSet } from "~/integrations";
import type { SevenTVApiEmoteSet, SevenTVApiSetEmote } from "../SevenTV.api";
import type { I7TVEmote } from "./SevenTVEmote";

export interface I7TVSet extends EmoteSet {
  emotes: I7TVEmote[];
  source: "SevenTV";
  name: string;
  capacity: number;
  id: string;
}

export class SevenTVSet implements I7TVSet {
  updatedAt;
  source;
  emotes;
  name;
  capacity;
  id;

  constructor(
    fetchedCollection: SevenTVApiEmoteSet & {
      emotes: NonNullable<SevenTVApiEmoteSet["emotes"]>;
    },
    to7TVEmoteCallback: (value: SevenTVApiSetEmote) => I7TVEmote,
  ) {
    this.id = fetchedCollection.id;
    this.name = fetchedCollection.name;
    this.emotes = fetchedCollection.emotes.map(to7TVEmoteCallback);
    this.source = "SevenTV" as const;
    this.updatedAt = Date.now();
    this.capacity = fetchedCollection.capacity;
  }
}
