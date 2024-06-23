import type {
  IEmote,
  IEmoteSet,
  IEmoteIntegration,
} from "~/integrations/abstract";

/* eslint-disable @typescript-eslint/no-namespace */
export module IBetterTTV {
  export interface Emote extends IEmote {}

  export interface EmoteSet extends IEmoteSet {
    emotes: IBetterTTV.Emote[];
  }

  export interface EmoteIntegration extends IEmoteIntegration {
    sets: IBetterTTV.EmoteSet[];
  }
}
