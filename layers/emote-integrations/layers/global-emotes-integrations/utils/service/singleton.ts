import { GlobalEmotesIntegrationsAPI } from "../api";
import { withEmoteIntegrationsIndexedDB } from "../../../indexed-db/utils/with";
import { GlobalEmotesIntegrationsIndexedDBStore } from "../indexed-db/store";
import { GlobalEmotesIntegrationsIndexedDBRepository } from "../indexed-db/repository";
import { GlobalEmotesIntegrationService } from "./implementation";

export const globalEmotesIntegrationsService
  = new GlobalEmotesIntegrationService(
    new GlobalEmotesIntegrationsIndexedDBRepository(
      new GlobalEmotesIntegrationsIndexedDBStore(
        withEmoteIntegrationsIndexedDB,
      ),
    ),
    new GlobalEmotesIntegrationsAPI($fetch.create({ baseURL: "/api/v1" })),
  );
