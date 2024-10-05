export type Base = IEmoteIntegration;
export type Ready = ReadyIntegration & { owner: IEmoteIntegrationOwner };
export type Failed = FailedIntegration;
export type Settled = SettledIntegration;
export type SettledRecord = SettledEmoteIntegrationsRecord;

type _MakeIndexedDBPersonEmoteIntegration<I extends Settled> = I extends Ready
  ? I & {
    sets: Array<
      Omit<I["sets"][number], "emotes"> & {
        emotesIds: string[];
      }
    >;
  }
  : I extends Failed
    ? I
    : never;

type IPersonEmoteCollectionIntegrationsRecord = {
  FrankerFaceZ: TFrankerFaceZ.Person.Integration;
  BetterTTV: TBetterTTV.Person.Integration;
  SevenTV: TSevenTV.Person.Integration;
  Twitch: TTwitch.Person.Integration;
};

export type IndexedDBRecord = {
  [S in EmoteSource]: _MakeIndexedDBPersonEmoteIntegration<
    IPersonEmoteCollectionIntegrationsRecord[S]
  >;
};

export type IndexedDB = IndexedDBRecord[keyof IndexedDBRecord];
