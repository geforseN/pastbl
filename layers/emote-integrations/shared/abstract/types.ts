import type { EmoteSource } from "../../layers/emote-sources/utils/external";

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
  isAnimated: boolean;
  isListed: boolean;
  isModifier: boolean;
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

interface Integration extends HasSource {
  status: string;
}

interface _IntegrationState extends HasFormedAt, HasSource {
  sets: IEmoteSet[];
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
