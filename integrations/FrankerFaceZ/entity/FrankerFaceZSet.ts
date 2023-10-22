import type { EmoteSet } from "~/integrations";
import type { FrankerFaceZEmote } from "./FrankerFaceZEmote";
import type {
  FrankerFaceZApiEmote,
  FrankerFaceZApiEmoteSet,
} from "../FrankerFaceZ.api";

export interface FrankerFaceZSet extends EmoteSet<FrankerFaceZEmote> {
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
