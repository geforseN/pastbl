import type { IBetterTTVApi } from "../api";
import type { IEmote } from "~/integrations";

type EmoteProperties = Prettify<
  IEmote & {
    source: "BetterTTV";
    type: "shared" | "channel" | "global";
    url: `//cdn.betterttv.net/emote/${string}`;
    height?: number;
    width?: number;
  }
>;
export type IBetterTTVEmote = EmoteProperties & {
  get title(): string;
  get asString(): string;
  get asWrappedString(): string;
};

type ConstructorParam = Pick<
  EmoteProperties,
  | "id"
  | "isAnimated"
  | "isModifier"
  | "token"
  | "type"
  | "url"
  | "width"
  | "height"
>;

export class BTTVEmote implements IBetterTTVEmote {
  id;
  url;
  token;
  type;
  isModifier;
  isAnimated = false;
  isListed = true as const;
  isWrapper = false as const;
  source = "BetterTTV" as const;
  width?;
  height?;

  // TODO: add codeOriginal from BaseUserEmote
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
  }

  func(param: ConstructorParam) {
    Object.freeze(Object.assign(this, param));
  }

  fromApi() {
    this.id = apiEmote.id;
    this.isAnimated = apiEmote.animated;
    this.isModifier = "modifier" in apiEmote && apiEmote.modifier;
    this.token = apiEmote.code;
    this.type = type;
    this.url = `//cdn.betterttv.net/emote/${this.id}` as const;
    this.width = apiEmote.width;
    this.height = apiEmote.height;
  }

  static create() {
    return {
      fromApi() {},
    };
  }

  deserialize() {
    return {
      fromIndexedDB(idbEmote: EmoteProperties) {
        return new BTTVEmote(idbEmote, "global");
      },
    };
  }

  serialize() {
    return {
      toIndexedDB() {},
    };
  }

  get title() {
    return `${this.token} emote from BetterTTV`;
  }

  get asString() {
    return `<img src="https:${this.url}/1x.webp" alt="${this.title}" loading="lazy">`;
  }

  get asWrappedString() {
    return `<span class="inline-block" title="${this.title}">${this.asString}</span>`;
  }
}
