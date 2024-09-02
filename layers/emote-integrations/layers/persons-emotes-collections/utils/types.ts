

export interface IPersonEmoteCollection extends HasFormedAt {
  integrations: TEmoteIntegrations.Person.SettledRecord;
  person: {
    twitch: PersonTwitch;
  };
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TPersonEmoteCollection {
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
    ? I & {
        sets: Array<
          Omit<I["sets"][number], "emotes"> & {
            emotesIds: EmoteId[];
          }
        >;
      }
    : I extends TEmoteIntegrations.Person.Failed
      ? I & { sets: undefined }
      : never;

  export type SettledIndexedDB = Omit<
    IPersonEmoteCollection,
    "integrations"
  > & {
    integrations: {
      [K in EmoteSource]: MakeIndexedDBPersonEmoteIntegration<
        TEmoteIntegrations.Person.SettledRecord[K]
      >;
    };
  };
}
