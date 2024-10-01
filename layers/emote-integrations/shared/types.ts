export * as Global from "./types.global";
export * as Person from "./types.person";

export type Base =
  | TEmoteIntegrations.Global.Ready
  | TEmoteIntegrations.Person.Ready;

export type Ready =
  | TEmoteIntegrations.Global.Ready
  | TEmoteIntegrations.Person.Ready;

export type Failed =
  | TEmoteIntegrations.Global.Failed
  | TEmoteIntegrations.Person.Failed;

export type Settled =
  | TEmoteIntegrations.Global.Settled
  | TEmoteIntegrations.Person.Settled;

export type SettledRecord =
  | TEmoteIntegrations.Global.SettledRecord
  | TEmoteIntegrations.Person.SettledRecord;

export type { SomeIntegration__MoveThis as __Some__ } from "./abstract/types";
