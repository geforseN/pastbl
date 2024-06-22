import type { IEmoteSet } from "./EmoteSet";
import type { HasFormedAt, HasSource } from "./_internal";

export interface IEmoteIntegration extends HasSource, HasFormedAt {
  sets: IEmoteSet[];
}
