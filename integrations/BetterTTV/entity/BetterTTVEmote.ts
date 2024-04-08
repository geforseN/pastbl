import type { IBetterTTVApi } from "../api";
import type { IEmote } from "~/integrations";

export type IBetterTTVEmote = Unwrap<
  IEmote & {
    source: "BetterTTV";
    type: "shared" | "channel" | "global";
    url: `https://cdn.betterttv.net/emote/${string}/1x.webp`;
    height?: number;
    width?: number;
  }
>;

export class BTTVEmote implements IBetterTTVEmote {
  id;
  url;
  token;
  type;
  isModifier;
  isAnimated;
  isListed = true as const;
  isWrapper = false as const;
  source = "BetterTTV" as const;
  width?;
  height?;

  // TODO: add codeOriginal from BaseUserEmote ! UPD: done, but ugly
  // TODO: think about type param, maybe remove it (somehow)?
  constructor(apiEmote: IBetterTTVApi["Emote"], type: IBetterTTVEmote["type"]) {
    this.id = apiEmote.id;
    this.isAnimated = apiEmote.animated;
    this.isModifier = "modifier" in apiEmote && apiEmote.modifier;
    this.token = apiEmote.code;
    this.type = type;
    this.url = `https://cdn.betterttv.net/emote/${this.id}/1x.webp` as const;
    this.width = apiEmote.width;
    this.height = apiEmote.height;
    if (
      "codeOriginal" in apiEmote &&
      typeof apiEmote.codeOriginal === "string"
    ) {
      this.codeOriginal = apiEmote.codeOriginal;
    }
  }
}
