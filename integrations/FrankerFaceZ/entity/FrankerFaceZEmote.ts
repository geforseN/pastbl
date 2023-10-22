import type { BaseEmote } from "~/integrations";
import type { FrankerFaceZApiEmote } from "../FrankerFaceZ.api";

export interface FrankerFaceZEmote extends BaseEmote {
  type: "channel" | "global";
  width: number;
  source: "FrankerFaceZ";
}

export class FFZEmote implements FrankerFaceZEmote {
  id;
  isAnimated;
  isListed;
  isModifier;
  isZeroWidth;
  source;
  token;
  type;
  url;
  width;

  constructor(
    ffzApiEmote: FrankerFaceZApiEmote,
    type: FrankerFaceZEmote["type"],
  ) {
    this.id = `${ffzApiEmote.id}`;
    // LINK: https://api.frankerfacez.com/docs/?urls.primaryName=API%20v1#emote-effects
    // NOTE -
    // can get this value from ffzEmote.modifier_flags bitmap,
    // but it is not that simple, so just set this.isAnimated to false
    this.isAnimated = false;
    this.isListed = ffzApiEmote.status === 1;
    this.isModifier = "modifier" in ffzApiEmote ? ffzApiEmote.modifier : false;
    this.isZeroWidth = ffzApiEmote.modifier_flags % 1 === 0;
    this.source = "FrankerFaceZ" as const;
    this.token = ffzApiEmote.name;
    this.type = type;
    this.url = `//cdn.frankerfacez.com/emote/${this.id}` as const;
    this.width = ffzApiEmote.width;
  }
}
