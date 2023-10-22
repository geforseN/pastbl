import type { Emote } from "~/integrations";
import type { SevenTVApiSetEmote } from "../SevenTV.api";

export interface I7TVEmote extends Emote {
  originalName?: string;
  source: "SevenTV";
  tags?: string[];
  type: "global" | "channel";
  url: `//cdn.7tv.app/emote/${string}`;
  width: number;
}

export class SevenTVEmote implements I7TVEmote {
  id;
  url;
  token;
  source;
  isAnimated;
  isModifier;
  isListed;
  isZeroWidth;
  tags;
  width;
  type;

  constructor(seventvEmote: SevenTVApiSetEmote, type: I7TVEmote["type"]) {
    this.id = seventvEmote.id;
    this.isAnimated = seventvEmote.data.animated;
    this.isListed = seventvEmote.data.listed;
    this.isModifier = seventvEmote.flags !== 0;
    this.isZeroWidth = seventvEmote.flags === 1;
    this.source = "SevenTV" as const;
    this.tags = seventvEmote.data.tags;
    this.token = seventvEmote.name;
    this.type = type;
    this.url = `//cdn.7tv.app/emote/${this.id}` as const;
    this.width = seventvEmote.data.host.files[1].width;
  }
}
