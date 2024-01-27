import type { EmoteSource } from ".";

export type InternalEmote = {
  id: string;
  isAnimated: boolean;
  isListed: boolean;
  isModifier: boolean;
  isWrapper: boolean;
  source: EmoteSource;
  token: string;
  url: string;
};

abstract class Emote {
  id: string;
  url: string;
  token: string;
  type: string;
  isModifier: boolean;
  isAnimated: boolean;
  isListed: boolean;
  isWrapper: boolean;
  source: EmoteSource;
  width?: number;
  height?: number;
  originalToken?: string;

  constructor(emote) {
    this.id = emote.id;
    this.isAnimated = emote.isAnimated;
    this.isModifier = emote.isModifier;
    this.token = emote.token;
    this.type = emote.type;
    this.url = emote.url;
    this.isListed = emote.isListed;
    this.isWrapper = emote.isWrapper;
    this.source = emote.source;
    this.width = emote.width;
    this.height = emote.height;
    this.originalToken = emote.originalToken;
  }

  static create() {
    return {
      fromApi: () => {},
    };
  }

  serialize() {
    return {
      toIndexedDB: () => {
        const { width, height, originalToken, ...result } = this;
        const possibleKeys = Object.keys({ width, height, originalToken });
        for (const key of possibleKeys) {
          if (Object.hasOwn(this, key)) {
            result[key] = this[key];
          }
        }
        return result;
      },
    };
  }

  get title() {
    return `${this.token} emote from BetterTTV`;
  }

  get asString() {
    return `<img src="https:${this.url}/1x.webp" width="${this.width}" height="${this.height}" alt="${this.title}" loading="lazy">`;
  }

  get asWrappedString() {
    return `<span class="inline-block" title="${this.title}">${this.asString}</span>`;
  }
}
