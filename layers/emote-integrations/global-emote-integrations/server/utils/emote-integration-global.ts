declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace EmoteIntegration.Global {
    type OK = "YES?";

    export type Base = IEmoteIntegration;
    export type Ready = Omit<ReadyIntegration, "owner">;
    export type Failed = FailedIntegration;
    export type Settled = SettledIntegration;
    export type SettledRecord = SettledEmoteIntegrationsRecord;

    export type SettledOfSource<S extends EmoteSource> =
      SettledEmoteIntegrationsRecord[S];
  }
}
