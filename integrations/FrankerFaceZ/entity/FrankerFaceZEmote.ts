import type { FrankerFaceZApiEmote } from "../FrankerFaceZ.api";
import type { IEmote } from "~/integrations";

export interface FrankerFaceZEmote extends IEmote {
  source: "FrankerFaceZ";
  type: "channel" | "global";
  url: `//cdn.frankerfacez.com/emote/${IEmote["id"]}/1`;
  width?: number;
  height?: number;
}

// LINK: https://api.frankerfacez.com/docs/?urls.primaryName=API%20v1#emote-effects

export class FFZEmote implements FrankerFaceZEmote {
  id;
  isAnimated = false;
  isListed;
  isModifier;
  isWrapper;
  source = "FrankerFaceZ" as const;
  token;
  type;
  url;
  width;
  height;

  constructor(apiEmote: FrankerFaceZApiEmote, type: FrankerFaceZEmote["type"]) {
    this.id = apiEmote.id.toString();
    this.isListed = apiEmote.status === 1;
    this.isModifier = "modifier" in apiEmote && apiEmote.modifier;
    this.isWrapper = apiEmote.modifier_flags % 2 === 0;
    this.token = apiEmote.name;
    this.type = type;
    this.url = `//cdn.frankerfacez.com/emote/${this.id}/1` as const;
    this.width = apiEmote.width;
    this.height = apiEmote.height;
  }
}
