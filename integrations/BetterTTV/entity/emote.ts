import { object } from "zod";
import type { IBetterTTVApi } from "../api";
import type { IEmote as IBaseEmote } from "~/integrations";

type EmoteProperties = Prettify<
  IBaseEmote & {
    source: "BetterTTV";
    type: "shared" | "channel" | "global";
    url: `//cdn.betterttv.net/emote/${string}`;
    height?: number;
    width?: number;
  }
>;
export type IEmote = EmoteProperties & {
  get title(): string;
  get asString(): string;
  get asWrappedString(): string;
};

function createEmoteFromApi() {}

function assignWhenTruthy(target: object, source: object) {
  Object.entries(source).forEach(([key, value]) => {
    if (value) {
      Object.assign(target, { [key]: value });
    }
  });
}

const serialize = {
  toIndexedDB(emote: IEmote) {
    const { width, height, ...value } = emote;
    assignWhenTruthy(value, { width, height });
    return value;
  },
};
