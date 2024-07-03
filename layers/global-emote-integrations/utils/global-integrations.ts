import { idb } from "~/client-only/IndexedDB";
import type { TEmoteIntegrations } from "~/integrations/abstract";
import { emoteSources, type EmoteSource } from "~/integrations/emote-source";
import { API } from "./global-integrations.api";

const emptyIntegrations = Object.freeze(
  flatGroupBySource(
    emoteSources.map((source) => Object.freeze(makeEmptyIntegration(source))),
  ),
);

export const service = {
  __put(integration: TEmoteIntegrations.Global.Settled) {
    return storage.put(integration);
  },
  async load<S extends EmoteSource>(source: S) {
    const integration = await API.get(source);
    await storage.put(integration);
    return integration;
  },
  async loadAll() {
    const all = await API.getAll();
    const values = objectValues(all);
    await storage.putMany(values);
    return all;
  },
  async loadMany<S extends EmoteSource>(sources: S[]) {
    const response = await API.getMany(sources);
    const values = objectValues(response.integrations);
    await storage.putMany(values);
    return values;
  },
  async getAll(): Promise<TEmoteIntegrations.Global.SettledRecord> {
    if (import.meta.server) {
      return emptyIntegrations;
    }
    const stored = await storage.getAll();
    const settled = emoteSources.map(
      (source) =>
        stored.find((integration) => integration.source === source) || {
          source,
          status: "failed",
          reason: `Failed to find in storage`,
        },
    );
    return flatGroupBySource(settled);
  },
};

const storage = {
  async getAll() {
    const collectionsIdb = await idb.collections;
    return await collectionsIdb.global.getAll();
  },
  async put(integration: TEmoteIntegrations.Global.Settled) {
    const collectionsIdb = await idb.collections;
    return await collectionsIdb.global.put(integration);
  },
  async putMany<I extends TEmoteIntegrations.Global.Settled>(
    integrations: I[],
  ) {
    const collectionsIdb = await idb.collections;
    return await Promise.all(
      integrations.map((collection) => collectionsIdb.global.put(collection)),
    );
  },
};
