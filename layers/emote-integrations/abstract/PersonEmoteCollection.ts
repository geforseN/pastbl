import type { IEmote, IPersonEmoteCollection, TEmoteIntegrations } from ".";
import type { EmoteSource } from "../../emote-sources/utils/emote-sources";

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace TPersonEmoteCollection {
  export type Default = IPersonEmoteCollection;

  type MakeIndexedDBPersonEmoteIntegration<
    I extends TEmoteIntegrations.Person.Settled,
  > = I extends TEmoteIntegrations.Person.Ready
    ? I & {
        sets: Array<
          Omit<I["sets"][number], "emotes"> & {
            emoteIds: IEmote["id"][];
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
