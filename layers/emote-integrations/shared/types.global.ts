export type Base = IEmoteIntegration;
export type Ready = ReadyIntegration;
export type Failed = FailedIntegration;
export type Settled = SettledIntegration;
export type SettledRecord = SettledEmoteIntegrationsRecord;

export type SettledOfSource<S extends EmoteSource> =
  SettledEmoteIntegrationsRecord[S];

export type Of<S extends EmoteSource> = SettledOfSource<S>;
