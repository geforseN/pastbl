import { idb } from "~/client-only/IndexedDB";
import { emoteSources, type EmoteSource } from "~/integrations";
import type {
  SettledEmoteIntegrationsRecord,
  SettledEmoteIntegration,
} from "~/integrations/integrations";
import { makeEmptyIntegration } from "~/integrations/integrations";

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
    await storage.put(...values);
    return all;
  },
  async loadMany(sources: EmoteSource[]) {
    const integrations = await api.getMany(sources);
    const values = objectValues(integrations);
    await storage.put(...values);
    return values;
  },
  async getAll(): Promise<SettledEmoteIntegrationsRecord> {
    if (process.server) {
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
  async put(...integrations: SettledEmoteIntegration<EmoteSource>[]) {
    const collectionsIdb = await idb.collections;
    assert.ok(integrations.length);
    if (integrations.length === 1) {
      return await collectionsIdb.global.put(integrations[0]);
    }
    return await Promise.all(
      integrations.map((collection) => collectionsIdb.global.put(collection)),
    );
  },
};

const api = {
  get<S extends EmoteSource>(source: S) {
    return $fetch(`/api/v1/collections/global/integrations/${source}`);
  },
  getMany(sources: EmoteSource[]) {
    return $fetch("/api/v1/collections/global/integrations", {
      query: { sources: sources.join("+") },
    });
  },
  getAll() {
    return $fetch("/api/v1/collections/global/integrations/all");
  },
};
