import type { FrankerFaceZApiEmote } from "../FrankerFaceZ.api";
import type { IEmote } from "~/integrations";

export interface FrankerFaceZEmote extends IEmote {
  source: "FrankerFaceZ";
  type: "channel" | "global";
  url: `//cdn.frankerfacez.com/emote/${IEmote["id"]}`;
  width?: number;
  height?: number;
}

export class FFZEmote implements FrankerFaceZEmote {
  id;
  isAnimated;
  isListed;
  isModifier;
  isWrapper;
  source;
  token;
  type;
  url;
  width?: number;
  height?: number;

  constructor(apiEmote: FrankerFaceZApiEmote, type: FrankerFaceZEmote["type"]) {
    this.id = `${apiEmote.id}`;
    // LINK: https://api.frankerfacez.com/docs/?urls.primaryName=API%20v1#emote-effects
    // NOTE -
    // can get this value from ffzEmote.modifier_flags bitmap,
    // but it is not that simple, so just set this.isAnimated to false
    this.isAnimated = false;
    this.isListed = apiEmote.status === 1;
    this.isModifier = "modifier" in apiEmote ? apiEmote.modifier : false;
    this.isWrapper = apiEmote.modifier_flags % 1 === 0;
    this.source = "FrankerFaceZ" as const;
    this.token = apiEmote.name;
    this.type = type;
    this.url = `//cdn.frankerfacez.com/emote/${this.id}/1` as const;
    this.width = apiEmote.width;
    this.height = apiEmote.height;
  }
}
