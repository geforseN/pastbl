import type { EmoteSource } from "~/integrations";

export type EmoteIntegrationStyle = {
  borderAccent: string;
  backgroundBase: string;
  backgroundAccent: string;
  outlineAccent: string;
  scrollbar: string;
};

export const emoteIntegrationsStyles: Record<
  EmoteSource,
  EmoteIntegrationStyle
> = {
  BetterTTV: {
    borderAccent: "border-bttv-accent",
    backgroundBase: "bg-bttv-base",
    backgroundAccent: "bg-bttv-accent",

    outlineAccent: "outline-bttv-accent",
    scrollbar: "scrollbar-track-bttv-base scrollbar-thumb-bttv-accent",
  },
  FrankerFaceZ: {
    borderAccent: "border-ffz-accent",
    backgroundBase: "bg-ffz-base",
    backgroundAccent: "bg-ffz-accent",
    outlineAccent: "outline-ffz-accent",
    scrollbar: "scrollbar-track-ffz-base scrollbar-thumb-ffz-accent",
  },
  SevenTV: {
    borderAccent: "border-7tv-accent",
    backgroundBase: "bg-7tv-base",
    backgroundAccent: "bg-7tv-accent",
    outlineAccent: "outline-7tv-accent",
    scrollbar: "scrollbar-track-7tv-base scrollbar-thumb-7tv-accent",
  },
  Twitch: {
    borderAccent: "border-twitch-accent",
    backgroundBase: "bg-twitch-base",
    backgroundAccent: "bg-twitch-accent",
    outlineAccent: "outline-twitch-accent",
    scrollbar: "scrollbar-track-twitch-base scrollbar-thumb-twitch-accent",
  },
};
