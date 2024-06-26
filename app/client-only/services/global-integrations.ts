import { idb } from "~/client-only/IndexedDB";
import { emoteSources, type EmoteSource } from "~/integrations/emote-source";
import {
  makeEmptyIntegration,
  type SettledEmoteIntegrationsRecord,
  type SettledEmoteIntegration,
} from "~/integrations/integrations";
import { globalIntegrationsAPI as api } from "~~/layers/emotes/utils/global-integrations.api";

const emptyIntegrations = Object.freeze(
  flatGroupBySource(
    emoteSources.map((source) => Object.freeze(makeEmptyIntegration(source))),
  ),
);

export const service = {
  __put(integration: SettledEmoteIntegration) {
    return storage.put(integration);
  },
  async load<S extends EmoteSource>(source: S) {
    const integration = await api.get(source);
    await storage.put(integration);
    return integration;
  },
  async loadAll() {
    const all = await api.getAll();
    const values = objectValues(all);
    await storage.putMany(values);
    return all;
  },
  async loadMany(sources: EmoteSource[]) {
    const response = await api.getMany(sources);
    const values = objectValues(response.integrations);
    await storage.putMany(values);
    return values;
  },
  async getAll(): Promise<SettledEmoteIntegrationsRecord> {
    if (import.meta.server) {
      return emptyIntegrations;
    }
    const stored = await storage.getAll();
    const all = emoteSources.map(
      (source) =>
        stored.find((integration) => integration.source === source) || {
          source,
          status: "failed",
          reason: `Failed to find in storage`,
        },
    );
    return flatGroupBySource(all);
  },
};

const storage = {
  async getAll() {
    const collectionsIdb = await idb.collections;
    return await collectionsIdb.global.getAll();
  },
  async put(integration: SettledEmoteIntegration<EmoteSource>) {
    const collectionsIdb = await idb.collections;
    return await collectionsIdb.global.put(integration);
  },
  async putMany(integrations: SettledEmoteIntegration<EmoteSource>[]) {
    const collectionsIdb = await idb.collections;
    return await Promise.all(
      integrations.map((collection) => collectionsIdb.global.put(collection)),
    );
  },
};
