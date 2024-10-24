import { EmoteSources } from "./emote-sources.ts";

const emoteSources = [
  "BetterTTV" as const,
  "FrankerFaceZ" as const,
  "SevenTV" as const,
  "Twitch" as const,
];

export type EmoteSource = (typeof emoteSources)[number];

export const allEmoteSources = new EmoteSources(emoteSources);
