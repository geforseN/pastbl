import type { IEmote } from "./Emote";

export interface IEmoteSet {
  readonly name: string;
  readonly emotes: IEmote[];
}
