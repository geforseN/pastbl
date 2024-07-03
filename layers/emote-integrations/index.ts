import { BetterTTV } from "./BetterTTV";
import type { TBetterTTV } from "./BetterTTV/types";

import { FrankerFaceZ } from "./FrankerFaceZ";
import type { TFrankerFaceZ } from "./FrankerFaceZ/types";

import { SevenTV } from "./SevenTV";
import type { TSevenTV } from "./SevenTV/types";

import { Twitch } from "./Twitch";
import type { TTwitch } from "./Twitch/types";

export { BetterTTV } from "./BetterTTV";
export type { TBetterTTV } from "./BetterTTV/types";

export { FrankerFaceZ } from "./FrankerFaceZ";
export type { TFrankerFaceZ } from "./FrankerFaceZ/types";

export { SevenTV } from "./SevenTV";
export type { TSevenTV } from "./SevenTV/types";

export { Twitch } from "./Twitch";
export type { TTwitch } from "./Twitch/types";

export {
  type EmoteSource,
  emoteSources,
  isEmoteSource,
} from "../emote-sources/utils/emote-sources";

export type IPersonEmoteCollectionIntegrationsRecord = {
  FrankerFaceZ: TFrankerFaceZ.Person.Integration;
  BetterTTV: TBetterTTV.Person.Integration;
  SevenTV: TSevenTV.Person.Integration;
  Twitch: TTwitch.Person.Integration;
};

export const emoteIntegrations = {
  BetterTTV,
  FrankerFaceZ,
  SevenTV,
  Twitch,
} as const;
