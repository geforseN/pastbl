export type Default = IPersonEmoteCollection;

export interface Minimal {
  person: {
    twitch: {
      login: TwitchUserLogin;
    };
  };
}

type MakeIndexedDBPersonEmoteIntegration<
  I extends TEmoteIntegrations.Person.Settled,
> = I extends TEmoteIntegrations.Person.Ready
  // eslint-disable-next-line
  ? I & {
    sets: Array<
      Omit<I["sets"][number], "emotes"> & {
        emotesIds: EmoteId[];
      }
    >;
  }
  : I extends TEmoteIntegrations.Person.Failed
    ? I & { sets: never }
    : never;

export type SettledIndexedDB = Omit<IPersonEmoteCollection, "integrations"> & {
  integrations: {
    [K in EmoteSource]: MakeIndexedDBPersonEmoteIntegration<
      TEmoteIntegrations.Person.SettledRecord[K]
    >;
  };
};
