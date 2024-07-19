import type { IEmote } from "./Emote";

export type IEmoteSet<E extends IEmote = IEmote> = Readonly<{
  name: string;
  emotes: E[];
  type: E["type"];
  source: E["source"];
}>;
