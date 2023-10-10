import { BetterTTVEmote } from "./BetterTTV";

export type __BTTV__GlobalEmote__ = {
  id: string;
  code: string;
  imageType: "png" | "webp" | "gif";
  animated: boolean;
  modifier: boolean;
  hight?: number;
  width?: number;
  userId?: string;
  userName?: string;
  userDisplayName?: string;
  userProviderId?: string;
};

export type __BTTV__UserEmote__ = {
  animated: boolean;
  approvalStatus: string;
  code: string;
  createdAt: ReturnType<Date["toISOString"]>;
  global: boolean;
  id: string;
  imageType: "png" | "webp" | "gif";
  live: boolean;
  sharing: boolean;
  updatedAt: ReturnType<Date["toISOString"]>;
  userId: string;
};

export type __BTTV__UserData__ = {
  bots: unknown[];
  channelEmotes: __BTTV__UserEmote__[]; // NOTE: type can be wrong
  displayName: string;
  id: string;
  name: string;
  providerId: string;
  sharedEmotes: __BTTV__UserEmote__[]; // NOTE: type can be wrong
};

// NOTE: result of fetch includes modifier emote (e.g. c!, h!, l!) which are not yet supported
export async function fetchBetterTTVGlobalEmotes(): Promise<BetterTTVEmote[]> {
  return fetch("https://api.betterttv.net/3/cached/emotes/global")
    .then((response) => {
      return response.json();
    })
    .then((emotesArray: __BTTV__GlobalEmote__[]) =>
      emotesArray.map((emote) => new BetterTTVEmote(emote)),
    );
}

export async function fetchBetterTTVUserEmotes(
  userId: string,
): Promise<BetterTTVEmote[]> {
  return fetch(`https://api.betterttv.net/3/users/${userId}`)
    .then((response) => {
      return response.json();
    })
    .then((data: __BTTV__UserData__) => {
      return [
        ...data.channelEmotes.map((emote) => new BetterTTVEmote(emote)),
        ...data.sharedEmotes.map((emote) => new BetterTTVEmote(emote)),
      ];
    });
}
