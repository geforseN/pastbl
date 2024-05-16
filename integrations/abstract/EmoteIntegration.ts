import type { IEmote } from "./Emote";
import type { IEmoteSet } from "./EmoteSet";
import type { HasFormedAt, HasSource } from ".";

export interface IEmoteIntegration<Set extends IEmoteSet<IEmote>>
  extends HasSource,
    HasFormedAt {
  sets: Set[];
}
