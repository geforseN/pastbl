import type { EmoteSource } from ".";

export interface IEmote {
  id: string;
  // isAnimated: boolean;
  // isListed: boolean;
  // isModifier: boolean;
  // isWrapper: boolean;
  source: EmoteSource;
  token: string;
  url: string;
}

const Emote = {
  Twitch: {
    global() {},
    channel() {},
  },
};

const twitchEmoteProto = {
  source: "Twitch",
  width: 28,
  height: 28,
} as const;

const twitchGlobalEmoteProto = {
  ...twitchEmoteProto,
  type: "global",
};

const twitchChannelEmoteProto = {
  ...twitchEmoteProto,
  type: "channel",
};

function makeGlobalTwitchEmote() {}
function makeChannelTwitchEmote({ id }) {}

export abstract class AEmote {
  id: string;
  token: string;
  url: string;

  abstract get source(): EmoteSource;
  abstract get type(): "global" | "channel";

  constructor({
    id,
    token,
    _url,
  }: {
    id: string;
    token: string;
    _url: string;
  }) {
    this.id = id;
    this.token = token;
    this.url = _url;
  }

  toJSON() {
    return {
      ...this,
      source: this.source,
      type: this.type,
    };
  }
}
