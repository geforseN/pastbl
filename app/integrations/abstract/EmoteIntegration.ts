import type { EmoteSource } from "../emote-source";
import type { IEmoteSet } from "./EmoteSet";
import type { HasFormedAt, HasSource } from "./_internal";

export interface IEmoteIntegration extends HasSource, HasFormedAt {
  sets: IEmoteSet[];
  status: string;
}

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
