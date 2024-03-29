import type { SevenTVApiSetEmote } from "../SevenTV.api";
import type { IEmote } from "~/integrations";

export interface I7TVEmote extends IEmote {
  originalName?: string;
  source: "SevenTV";
  tags?: string[];
  type: "global" | "channel";
  url: `https://cdn.7tv.app/emote/${string}/1x.webp`;
  width: number;
  height: number;
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
  height;

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
    this.url = `https://cdn.7tv.app/emote/${this.id}/1x.webp` as const;
    this.width = apiEmote.data.host.files[1].width;
    this.height = apiEmote.data.host.files[1].height;
  }
}
