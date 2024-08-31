import type { TEmoteIntegrations } from "$/emote-integrations/";
import type { TPersonEmoteCollection } from "$persons-emotes-collections";

export class PersonIndexedDBEmoteCollectionDepopulation {
  constructor(private readonly collection: TPersonEmoteCollection.Default) {}

  execute() {
    const { integrations, ...rawCollectionProperties } = this.collection;
    const integrationsValues = Object.values(integrations);
    const rawCollection = {
      ...rawCollectionProperties,
      integrations: flatGroupBySource(integrationsValues, (integration) => {
        if (isEmotesIntegrationFailed(integration)) {
          return integration;
        }
        return {
          ...integration,
          sets: integration.sets.map(({ emotes, ...set }) => ({
            ...set,
            emotesIds: emotes.map((emote) => emote.id),
          })),
        };
      }),
    };
    const emotes = integrationsValues
      .filter(isEmotesIntegrationReady)
      .flatMap((integration) => {
        return (integration as TEmoteIntegrations.Ready).sets.flatMap(
          (set) => set.emotes,
        );
      });
    return { rawCollection, emotes };
  }
}
