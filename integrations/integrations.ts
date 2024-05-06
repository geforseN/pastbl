import type { EmoteSource } from ".";

type BaseEmoteIntegration<SO extends EmoteSource, ST extends string> = {
  readonly source: SO;
  readonly status: ST;
};

type EmoteIntegrationState<SE extends object> = {
  readonly formedAt: number;
  readonly sets: SE[];
};

type IntegrationError = {
  readonly formedAt: number;
  readonly reason?: string;
};

export type ReadyIntegration<SO extends EmoteSource> = BaseEmoteIntegration<
  SO,
  "ready"
> &
  EmoteIntegrationState<object>;

export type FailedIntegration<SO extends EmoteSource> = BaseEmoteIntegration<
  SO,
  "failed"
> &
  IntegrationError;

export type LoadingIntegration<SO extends EmoteSource> = BaseEmoteIntegration<
  SO,
  "loading"
>;

export type RefreshingIntegration<SO extends EmoteSource> =
  BaseEmoteIntegration<SO, "refreshing"> & EmoteIntegrationState<object>;

export type ReadyOrFailedIntegration<SO extends EmoteSource = EmoteSource> =
  | ReadyIntegration<SO>
  | FailedIntegration<SO>;

export type SomeEmoteIntegration<SO extends EmoteSource = EmoteSource> =
  | ReadyIntegration<SO>
  | FailedIntegration<SO>
  | LoadingIntegration<SO>
  | RefreshingIntegration<SO>;

export type SomeEmoteIntegrationsRecord = {
  [SO in EmoteSource]: SomeEmoteIntegration<SO>;
};

export type ReadyOrFailedEmoteIntegrationsRecord = {
  [SO in EmoteSource]: ReadyOrFailedIntegration<SO>;
};

export function isReadyIntegration<SO extends EmoteSource>(
  integration: SomeEmoteIntegration<SO>,
): integration is ReadyIntegration<SO> {
  return integration.status === "ready";
}
