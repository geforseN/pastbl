import type { BetterTTVApiEmote } from "../BetterTTV.api";
import type { IEmote } from "~/integrations";

export interface BetterTTVEmote extends IEmote {
  source: "BetterTTV";
  type: "shared" | "channel" | "global";
  url: `//cdn.betterttv.net/emote/${string}`;
}

export class BTTVEmote implements BetterTTVEmote {
  id;
  isAnimated;
  isListed;
  isModifier;
  isWrapper;
  source;
  token;
  type;
  url;

  constructor(apiEmote: BetterTTVApiEmote, type: BetterTTVEmote["type"]) {
    this.id = apiEmote.id;
    this.isAnimated = apiEmote.animated;
    this.isListed = true;
    this.isModifier = "modifier" in apiEmote ? apiEmote.modifier : false;
    this.isWrapper = false;
    this.source = "BetterTTV" as const;
    this.token = apiEmote.code;
    this.type = type;
    this.url = `//cdn.betterttv.net/emote/${this.id}` as const;
  }
}
