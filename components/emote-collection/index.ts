import type {
  EmoteSource,
  IGlobalEmoteCollectionRecord,
  IUserEmoteIntegrationRecord,
} from "~/integrations";

export type CollectionStyle = {
  borderAccent: string;
  backgroundBase: string;
  outlineAccent: string;
  scrollbar: string;
};

export const collectionsStyles: Record<EmoteSource, CollectionStyle> = {
  BetterTTV: {
    borderAccent: "border-bttv-accent",
    backgroundBase: "bg-bttv-base",
    outlineAccent: "outline-bttv-accent",
    scrollbar: "scrollbar-track-bttv-base scrollbar-thumb-bttv-accent",
  },
  FrankerFaceZ: {
    borderAccent: "border-ffz-accent",
    backgroundBase: "bg-ffz-base",
    outlineAccent: "outline-ffz-accent",
    scrollbar: "scrollbar-track-ffz-base scrollbar-thumb-ffz-accent",
  },
  SevenTV: {
    borderAccent: "border-7tv-accent",
    backgroundBase: "bg-7tv-base",
    outlineAccent: "outline-7tv-accent",
    scrollbar: "scrollbar-track-7tv-base scrollbar-thumb-7tv-accent",
  },
  Twitch: {
    borderAccent: "border-twitch-accent",
    backgroundBase: "bg-twitch-base",
    outlineAccent: "outline-twitch-accent",
    scrollbar: "scrollbar-track-twitch-base scrollbar-thumb-twitch-accent",
  },
};

type Props<
  SourceT extends EmoteSource,
  RecordT extends Record<EmoteSource, unknown>,
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
  SourceT,
  IUserEmoteIntegrationRecord
>;

export type GlobalCollectionProps<SourceT extends EmoteSource> = Props<
  SourceT,
  IGlobalEmoteCollectionRecord
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
