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
    border: "border-[#63b3ed]",
    background: "bg-[#181d1f]",
    outline: "outline-[#63b3ed]",
    asd: "bg-[#63b3ed]",
  },
  FrankerFaceZ: {
    border: "border-ffz",
    background: "bg-[#222222]",
    outline: "outline-ffz",
    asd: "bg-ffz",
  },
  SevenTV: {
    border: "border-[#2599cd]",
    background: "bg-[#181d1f]",
    outline: "outline-[#2599cd]",
    asd: "bg-[#2599cd]",
  },
  Twitch: {
    border: "border-[#a970ff]",
    background: "bg-[#0E0E10]",
    outline: "outline-[#a970ff]",
    asd: "bg-[#a970ff]",
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
