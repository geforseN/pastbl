import type {
  EmoteSource,
  IGlobalEmoteCollectionRecord,
  IUserEmoteIntegrationRecord,
} from "~/integrations";

export type Colors = {
  border: string;
  background: string;
  outline: string;
  asd: string;
};

export const colorsClassRecord: Record<EmoteSource, Colors> = {
  BetterTTV: {
    border: "border-bttv-accent",
    background: "bg-bttv-base",
    outline: "outline-bttv-accent",
    asd: "bg-bttv-accent",
  },
  FrankerFaceZ: {
    border: "border-ffz-accent",
    background: "bg-ffz-base",
    outline: "outline-ffz-accent",
    asd: "bg-ffz-accent",
  },
  SevenTV: {
    border: "border-7tv-accent",
    background: "bg-7tv-base",
    outline: "outline-7tv-accent",
    asd: "bg-7tv-accent",
  },
  Twitch: {
    border: "border-twitch-accent",
    background: "bg-twitch-base",
    outline: "outline-twitch-accent",
    asd: "bg-twitch-accent",
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
} & (
  | {
      status: "ready";
      collection: RecordT[SourceT];
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
