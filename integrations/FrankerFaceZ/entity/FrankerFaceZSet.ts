import type {
  FrankerFaceZApiEmote,
  FrankerFaceZApiEmoteSet,
} from "../FrankerFaceZ.api";
import type { FrankerFaceZEmote } from "./FrankerFaceZEmote";
import type { IEmoteSet } from "~/integrations";

export interface FrankerFaceZSet extends IEmoteSet<FrankerFaceZEmote> {
  source: "FrankerFaceZ";
}

export class FFZSet implements FrankerFaceZSet {
  emotes;
  id;
  name;
  source;
  updatedAt;

  constructor(
    ffzApiSet: FrankerFaceZApiEmoteSet,
    toFFZEmoteCallback: (value: FrankerFaceZApiEmote) => FrankerFaceZEmote,
  ) {
    this.emotes = ffzApiSet.emoticons.map(toFFZEmoteCallback);
    this.id = ffzApiSet.id.toString();
    this.name = ffzApiSet.title;
    this.source = "FrankerFaceZ" as const;
    this.updatedAt = Date.now();
  }
}
