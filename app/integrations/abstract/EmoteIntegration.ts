import type { EmoteSource } from "../emote-source";
import type { IEmoteSet } from "./EmoteSet";
import type { HasFormedAt, HasSource } from "./_internal";

export interface IEmoteIntegration extends HasSource, HasFormedAt {
  sets: IEmoteSet[];
  status: string;
}

// ----------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace IEmoteIntegrations {
  export type Base = IEmoteIntegration;
  export type Ready = ReadyIntegration;
  export type Failed = FailedIntegration;
  export type Loading = LoadingIntegration;
  export type Refreshing = RefreshingIntegration;
  export type Some = SomeIntegration;
}

interface Integration extends HasSource {
  status: string;
}

interface _IntegrationState extends HasFormedAt {
  sets: IEmoteSet[];
}

interface StateIntegration extends Integration, _IntegrationState {}

interface _IntegrationError {
  reason: string;
}

interface ErrorIntegration extends Integration, _IntegrationError {}

export interface ReadyIntegration extends StateIntegration {
  status: "ready";
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

export type SomeIntegration =
  | ReadyIntegration
  | FailedIntegration
  | LoadingIntegration
  | RefreshingIntegration;

export type SettledIntegration = Extract<
  SomeIntegration,
  { status: "ready" | "failed" /* | "empty" */ }
>;

type IntegrationRecord<I extends Integration> = {
  [S in EmoteSource]: I & { source: S };
};

export type SomeEmoteIntegrationsRecord = IntegrationRecord<SomeIntegration>;

export type SettledEmoteIntegrationsRecord =
  IntegrationRecord<SettledIntegration>;
