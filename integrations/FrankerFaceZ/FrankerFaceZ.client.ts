import { BaseEmote, EmoteSet } from "..";
import {
  FrankerFaceZEmoteFromApi,
  FrankerFaceZEmoteSetFromApi,
} from "./FrankerFaceZ.api";

// NOTE: FFZ documentation
// LINK: https://api.frankerfacez.com/docs/?urls.primaryName=API%20v1

interface FrankerFaceZEmoteSet extends EmoteSet<FrankerFaceZEmote> {
  source: "FrankerFaceZ";
}

export class FFZEmoteSet implements FrankerFaceZEmoteSet {
  updatedAt;
  source;
  emotes;
  name;
  id;

  constructor(
    ffzApiSet: FrankerFaceZEmoteSetFromApi,
    toFFZEmoteCallback: (value: FrankerFaceZEmoteFromApi) => FrankerFaceZEmote,
  ) {
    this.id = ffzApiSet.id.toString();
    this.name = ffzApiSet.title;
    this.emotes = ffzApiSet.emoticons.map(toFFZEmoteCallback);
    this.source = "FrankerFaceZ" as const;
    this.updatedAt = Date.now();
  }
}

export class FFZEmote implements FrankerFaceZEmote {
  id;
  url;
  token;
  isAnimated;
  isModifier;
  isListed;
  source;
  type;
  isZeroWidth;

  constructor(
    ffzApiEmote: FrankerFaceZEmoteFromApi,
    type: FrankerFaceZEmote["type"],
  ) {
    this.id = `${ffzApiEmote.id}`;
    this.url = `//cdn.frankerfacez.com/emote/${this.id}` as const;
    this.token = ffzApiEmote.name;
    // NOTE: can get this value from ffzEmote.modifier_flags bitmap,
    // but it is not that simple, so just set this.isAnimated to false
    // LINK: https://api.frankerfacez.com/docs/?urls.primaryName=API%20v1#emote-effects
    this.isAnimated = false;
    this.isModifier = "modifier" in ffzApiEmote ? ffzApiEmote.modifier : false;
    this.isListed = ffzApiEmote.status === 1;
    this.isZeroWidth = ffzApiEmote.modifier_flags % 1 === 0;
    this.source = "FrankerFaceZ" as const;
    this.type = type;
  }
}

export interface FrankerFaceZEmote extends BaseEmote {
  type: "channel" | "global";
}

export class FFZCollection {
  name;
  updatedAt;
  sets;

  constructor(sets: FrankerFaceZEmoteSet[]) {
    this.name = "FrankerFaceZ";
    this.updatedAt = Date.now();
    this.sets = sets;
  }
}
