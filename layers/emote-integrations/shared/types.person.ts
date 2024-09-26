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
  FrankerFaceZ: any /* TFrankerFaceZ.Person.Integration */;
  BetterTTV: any /* TBetterTTV.Person.Integration */;
  SevenTV: any /* TSevenTV.Person.Integration */;
  Twitch: any /* TTwitch.Person.Integration */;
};

export type IndexedDBRecord = {
  [S in EmoteSource]: _MakeIndexedDBPersonEmoteIntegration<
    IPersonEmoteCollectionIntegrationsRecord[S]
  >;
};

export type IndexedDB = IndexedDBRecord[keyof IndexedDBRecord];
