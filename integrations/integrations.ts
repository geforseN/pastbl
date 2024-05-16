import type { EmoteSource } from ".";

type BaseEmoteIntegration<SO extends EmoteSource, ST extends string> = {
  readonly source: SO;
  readonly status: ST;
};

type EmoteIntegrationState<SE extends object> = {
  readonly formedAt: number;
  readonly sets: SE[];
};

type EmoteIntegrationError = {
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
  EmoteIntegrationError;

export type EmptyIntegration<SO extends EmoteSource> = BaseEmoteIntegration<
  SO,
  "empty"
>;

export type LoadingIntegration<SO extends EmoteSource> = BaseEmoteIntegration<
  SO,
  "loading"
>;

export type RefreshingIntegration<SO extends EmoteSource> =
  BaseEmoteIntegration<SO, "refreshing"> & EmoteIntegrationState<object>;

export type SettledEmoteIntegration<SO extends EmoteSource = EmoteSource> =
  | ReadyIntegration<SO>
  | FailedIntegration<SO>
  | EmptyIntegration<SO>;

export type SomeEmoteIntegration<SO extends EmoteSource = EmoteSource> =
  | SettledEmoteIntegration<SO>
  | LoadingIntegration<SO>
  | RefreshingIntegration<SO>;

export type SomeEmoteIntegrationsRecord = {
  [SO in EmoteSource]: SomeEmoteIntegration<SO>;
};

export type SettledEmoteIntegrationsRecord = {
  [SO in EmoteSource]: SettledEmoteIntegration<SO>;
};

export function canShowSets<SO extends EmoteSource>(
  integration: SomeEmoteIntegration<SO>,
): integration is { sets: object[] } {
  return (
    (integration.status === "ready" || integration.status === "refreshing") &&
    !!integration.sets
  );
}

export function hasReason<SO extends EmoteSource>(
  integration: SomeEmoteIntegration<SO>,
): integration is { reason: string } {
  return "reason" in integration && typeof integration.reason === "string";
}

export function hasFormedAt<SO extends EmoteSource>(
  integration: SomeEmoteIntegration<SO>,
): integration is { formedAt: number } {
  return "formedAt" in integration;
}

export function makeEmptyIntegration<SO extends EmoteSource>(
  source: SO,
): EmptyIntegration<SO> {
  return { source, status: "empty" };
}
