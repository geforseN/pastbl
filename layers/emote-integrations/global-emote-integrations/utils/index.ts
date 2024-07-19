import { withEmoteIntegrationsIndexedDB } from "../../indexed-db/utils";
import { GlobalEmoteIntegrationsIndexedDBStorage } from "./global-emote-integrations.indexed-db-storage";

export const globalEmoteIntegrationsService = new GlobalEmoteIntegrationService(
  new GlobalEmoteIntegrationsIndexedDBStorage(
    new GlobalEmoteIntegrationsIndexedDBStore(withEmoteIntegrationsIndexedDB),
  ),
  new GlobalEmoteIntegrationsAPI(
    $fetch.create({ baseURL: "/api/v1/collections/global" }),
  ),
);
