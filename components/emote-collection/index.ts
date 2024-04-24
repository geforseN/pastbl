import type {
  EmoteSource,
  IGlobalEmoteIntegrationRecord,
  IUserEmoteIntegrationRecord,
} from "~/integrations";

export type CollectionStyle = {
  borderAccent: string;
  backgroundBase: string;
  backgroundAccent: string;
  outlineAccent: string;
  scrollbar: string;
};

export const collectionsStyles: Record<EmoteSource, CollectionStyle> = {
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

type Props<
  RecordT extends Record<EmoteSource, unknown>,
  SourceT extends EmoteSource,
> = {
  source: SourceT;
  // NOTE: without question mark for 'collection' and 'reason' vue will show an error like 'Missing required prop'
  collection?: unknown;
  reason?: unknown;
  isRefreshing?: unknown;
} & (
  | {
      status: "ready";
      collection: RecordT[SourceT];
      isRefreshing: boolean;
    }
  | {
      status: "failed";
      reason: string;
    }
);

export type UserIntegrationProps<SourceT extends EmoteSource> = Props<
  IUserEmoteIntegrationRecord,
  SourceT
>;

export type GlobalIntegrationProps<SourceT extends EmoteSource> = Props<
  IGlobalEmoteIntegrationRecord,
  SourceT
>;

export const buttonComponentsStyles = {
  xs: {
    btn: "btn-xs",
    icon: "18",
    iconClass: "min-w-[18px]",
  },
  sm: {
    btn: "btn-sm",
    icon: "20",
    iconClass: "min-w-5",
  },
} as const;

export type ButtonSize = keyof typeof buttonComponentsStyles;
