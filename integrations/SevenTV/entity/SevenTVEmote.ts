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
  isWrapper;
  tags;
  width;
  type;

  constructor(apiEmote: SevenTVApiSetEmote, type: I7TVEmote["type"]) {
    this.id = apiEmote.id;
    this.isAnimated = apiEmote.data.animated;
    this.isListed = apiEmote.data.listed;
    this.isModifier = apiEmote.flags !== 0;
    this.isWrapper = apiEmote.flags === 1;
    this.source = "SevenTV" as const;
    this.tags = apiEmote.data.tags;
    this.token = apiEmote.name;
    this.type = type;
    this.url = `//cdn.7tv.app/emote/${this.id}` as const;
    this.width = apiEmote.data.host.files[1].width;
  }
}
