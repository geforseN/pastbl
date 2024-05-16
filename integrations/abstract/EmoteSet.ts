import type { IEmote } from "./Emote";

export interface IEmoteSet<Emote extends IEmote> {
  readonly name: string;
  readonly emotes: Emote[];
}
