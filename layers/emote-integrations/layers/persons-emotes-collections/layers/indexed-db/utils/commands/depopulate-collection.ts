import type * as TEmoteIntegrations from "../../../../../../shared/types";
import { isEmotesIntegrationReady, isEmotesIntegrationFailed } from "../../../../../../utils/guards";
import { flatGroupBySource } from "../../../../../emote-sources/utils/flat-group-by-source";
import { Default } from "../../../../shared/types/namespace";
import type * as TPersonEmoteCollection from "../../../../shared/types/namespace";

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
