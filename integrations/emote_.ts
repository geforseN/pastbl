import type { EmoteSource } from ".";

interface EmotePrimary {
  id: string;
  token: string;
}

export type EmoteProto = {
  source: EmoteSource;
  type: string;
};

export type EmoteSize = {
  width?: number;
  height?: number;
};

export type EmoteFlags = {
  isAnimated: boolean;
  isListed: boolean;
  isModifier: boolean;
  // TODO: wtf is this, remove me or what
  isWrapper: boolean | null;
};

export type Emote2 = Unwrap<
  EmotePrimary & EmoteProto & EmoteSize & EmoteFlags & { url: string }
>;

export interface IEmote {
  id: string;
  source: EmoteSource;
  token: string;
  url: string;
}

export abstract class AEmote implements EmotePrimary {
  abstract get source(): EmoteSource; // FIXME: or string and then use as const in implementation
  abstract get type(): "global" | "channel"; // FIXME: or string and then use as const in implementation
  abstract get url(): string;

  // eslint-disable-next-line no-useless-constructor
  constructor(
    public readonly id: string,
    public readonly token: string,
    // TODO use _flags for isAnimated, isListed
    private readonly _flags: (string | number | any)[],
  ) {}

  toJSON() {
    return {
      // TODO: SHOULD add constructorName on server level (Node.js) AND SHOULD use it on client level (Vue)
      // so user can instantiate object with class
      // which name === this.constructorName ,
      constructorName: "TodoEmoteClass",
      id: this.id,
      source: this.source,
      token: this.id,
      type: this.type,
    };
  }

  // NOTE: in create MAY use GOF pattern (forgot name, no Ethernet right now) which will get emote from cache if emote with such fn arguments already were (hoverer cache can hold old value, which need to be validated)
  abstract create(): this;
}
