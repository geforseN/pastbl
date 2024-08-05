import type { PersonsEmotesIndexedDBStore } from "#imports";
import type { TPersonEmoteCollection } from "../../../_/utils/types";

type __IS__ = TPersonEmoteCollection.SettledIndexedDB["integrations"];

type __I__ = __IS__[EmoteSource];

export class PersonIndexedDBEmoteCollectionIntegrationsRepopulate {
  constructor(
    private readonly integrations: __IS__,
    private readonly emotesStore: PersonsEmotesIndexedDBStore,
  ) {}

  async #populate(integration: /* READY, not failed */ __I__) {
    const source = integration.source;
    return {
      ...integration,
      sets: await Promise.all(
        integration.sets!!!!.map(async ({ emotesIds, ...set }) => ({
          ...set,
          emotes: await Promise.all(
            (emotesIds as string[]).map((emoteId) =>
              this.emotesStore.get([source, emoteId]),
            ),
          ),
        })),
      ),
    };
  }

  async execute() {
    return await Promise.all(
      objectValues(this.integrations)
        .filter(isEmotesIntegrationReady)
        .map((integration) => this.#populate(integration)),
    );
  }
}
