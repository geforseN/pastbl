export interface HasSource {
  source: EmoteSource;
}

export interface HasFormedAt {
  formedAt: number;
}

export type EmoteId = string;

export type IEmote = HasSource & {
  id: EmoteId;
  type: string;
  token: string;
  url: string;
  isListed: boolean;
  isModifier: boolean;
  isWrapper: boolean;
  width: number;
  height: number;
};

export type IEmoteSet<E extends IEmote = IEmote> = Readonly<{
  name: string;
  emotes: E[];
  type: E["type"];
  source: E["source"];
}>;

export interface IEmoteIntegrationOwner {
  pageAddress: string;
}

export interface IEmoteIntegration extends HasSource, HasFormedAt {
  sets: IEmoteSet[];
  status: string;
  source: IEmoteSet["source"];
  formedAt: number;
}

// ----------------------------------------------------------------

type IPersonEmoteCollectionIntegrationsRecord = {
  FrankerFaceZ: any /* TFrankerFaceZ.Person.Integration */;
  BetterTTV: any /* TBetterTTV.Person.Integration */;
  SevenTV: any /* TSevenTV.Person.Integration */;
  Twitch: any /* TTwitch.Person.Integration */;
};

interface Integration extends HasSource {
  status: string;
}

interface _IntegrationState extends HasFormedAt, HasSource {
  sets: IEmoteSet[];
  owner: IEmoteIntegrationOwner;
}

interface StateIntegration extends Integration, _IntegrationState {}

interface _IntegrationError {
  reason: string;
  code: string;
}

interface ErrorIntegration extends Integration, _IntegrationError {}

export interface ReadyIntegration extends StateIntegration {
  status: "ready";
  source: IEmoteSet["source"];
}

export interface EmptyIntegration extends Integration {
  status: "empty";
}

export interface LoadingIntegration extends Integration {
  status: "loading";
}

export interface FailedIntegration extends ErrorIntegration {
  status: "failed";
}

export interface RefreshingIntegration extends StateIntegration {
  status: "refreshing";
}

export type SomeIntegration__MoveThis =
  | ReadyIntegration
  | FailedIntegration
  | EmptyIntegration
  | LoadingIntegration
  | RefreshingIntegration;

export type SettledIntegration = Extract<
  SomeIntegration__MoveThis,
  { status: "ready" | "failed" }
>;

type IntegrationRecord<I extends Integration> = {
  [S in EmoteSource]: I & { source: S };
};

export type SettledEmoteIntegrationsRecord =
  IntegrationRecord<SettledIntegration>;

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace TEmoteIntegrations {
  export type Base = Global.Ready | Person.Ready;
  export type Ready = Global.Ready | Person.Ready;
  export type Failed = Global.Failed | Person.Failed;
  export type Settled = Global.Settled | Person.Settled;
  export type SettledRecord = Global.SettledRecord | Person.SettledRecord;

  export type __Some__ = SomeIntegration__MoveThis;

  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace Global {
    export type Base = IEmoteIntegration;
    export type Ready = Omit<ReadyIntegration, "owner">;
    export type Failed = FailedIntegration;
    export type Settled = SettledIntegration;
    export type SettledRecord = SettledEmoteIntegrationsRecord;

    export type SettledOfSource<S extends EmoteSource> =
      SettledEmoteIntegrationsRecord[S];

    export type Of<S extends EmoteSource> = SettledOfSource<S>;
  }

  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace Person {
    export type Base = IEmoteIntegration;
    export type Ready = ReadyIntegration;
    export type Failed = FailedIntegration;
    export type Settled = SettledIntegration;
    export type SettledRecord = SettledEmoteIntegrationsRecord;

    type _MakeIndexedDBPersonEmoteIntegration<I extends Person.Settled> =
      I extends Person.Ready
        ? I & {
            sets: Array<
              Omit<I["sets"][number], "emotes"> & {
                emotesIds: string[];
              }
            >;
          }
        : I extends Person.Failed
          ? I
          : never;

    export type IndexedDBRecord = {
      [S in EmoteSource]: _MakeIndexedDBPersonEmoteIntegration<
        IPersonEmoteCollectionIntegrationsRecord[S]
      >;
    };

    export type IndexedDB = IndexedDBRecord[keyof IndexedDBRecord];
  }
}
