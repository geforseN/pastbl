<template>
  <div class="w-96">
    <div v-if="collection.state.value !== null" class="space-y-2">
      <emote-collection-user-ready
        v-if="collection.state.value !== null"
        :async-state="collection"
        :is-collection-selected="
          userCollectionsStore.isCollectionSelected(login)
        "
        @delete="async () => await userCollectionsStore.deleteCollection(login)"
        @refresh="collection.execute(0, 'refresh')"
        @select="userCollectionsStore.selectCollection(login)"
        @unselect="userCollectionsStore.unselectCollection()"
        @refresh-integration="
          (integration) =>
            collection.execute(0, 'refresh-integration', integration)
        "
      />
      <div @mouseover="throttledMouseover">
        <div>
          <div>__</div>
          <div class="flex">
            Pastas with&nbsp;
            <chat-pasta-tag :tag="`@${login}`" class="w-fit" />
            &nbsp;tag
          </div>
          <template v-if="pastasStore.canShowPastas">
            <chat-pasta-list
              v-if="pastas?.length"
              class="pasta-list flex max-h-[50dvh] w-[420px] flex-col overflow-y-auto go-brr:max-h-[66dvh]"
              :items="pastas"
              @remove-pasta="(pasta) => pastasStore.removePasta(pasta)"
            />
            <div v-else class="flex">
              No pastas with tag&nbsp;
              <chat-pasta-tag :tag="`@${login}`" class="w-fit" />
              &nbsp;were found
            </div>
          </template>
        </div>
        <app-page-link-emotes />
        <!-- TODO: for list below must populate pastas with emotes of collection user -->
        <!-- <chat-pasta-list
          v-if="pastasStore.canShowPastas && pastasStore.pastasToShow.length"
          class="pasta-list flex max-h-[50dvh] w-[420px] flex-col overflow-y-auto go-brr:max-h-[66dvh]"
          :items="pastasStore.pastasToShow"
          @remove-pasta="(pasta) => pastasStore.removePasta(pasta)"
        /> -->
      </div>
      <app-page-link-emotes />
      <app-page-link-main />
    </div>
    <div v-else-if="collection.isLoading.value">Loading...</div>
    <div v-else-if="collection.error.value">
      <template v-if="isError(collection.error.value)">
        {{ collection.error.value.message }}
      </template>
      <template v-else>
        Failed to load user collection with login: {{ login }}
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { UseAsyncStateReturnBase } from "@vueuse/core";
import { userCollectionsService } from "~/client-only/services";
import { USERS_COLLECTIONS_API } from "~/client-only/services/userCollections";
import {
  type IUserEmoteCollection,
  type IUserEmoteIntegration,
} from "~/integrations";

const login = getRouteStringParam("nickname", toLowerCase);
const userCollectionsStore = useUserCollectionsStore();

const pastasStore = usePastasStore();

const onHoverHint = inject<ExtendedOnHoverHint>("onHoverHint") || raise();

const pastas = pastasStore.usersPastasMap.get(login);

const throttledMouseover = useThrottleFn(
  onHoverHint.allEmotesHandler,
  100,
  true,
);

const collection = useMyAsyncState(
  async (
    strategy: "get" | "refresh" | "refresh-integration" = "get",
    newIntegration?: IUserEmoteIntegration,
  ) => {
    if (process.server) {
      return null;
    }
    // FIXME: refactor, move to service
    switch (strategy) {
      case "get": {
        const collection_ = await userCollectionsService
          .get(login)
          .catch(async () => {
            const collection = await USERS_COLLECTIONS_API.get(login);
            await userCollectionsService.put(collection);
            return collection;
          });
        assert.ok(collection_, `No collection found with login: ${login}`);
        return collection_;
      }
      case "refresh": {
        return userCollectionsStore.loadCollection(login);
      }
      case "refresh-integration": {
        const collection_ = collection.state.value;
        assert.ok(
          collection_ && typeof newIntegration !== "undefined",
          `Failed to refresh emote integration ${newIntegration ? `: ${newIntegration.source}` : ""}`,
        );
        const newCollection = {
          ...collection_,
          integrations: {
            ...collection_.integrations,
            [newIntegration.source]: newIntegration,
          },
        } as IUserEmoteCollection;
        await userCollectionsService.put(newCollection);
        return newCollection;
      }
      default: {
        assert.fail(`Unknown strategy for user collection: ${strategy}`);
      }
    }
  },
  null,
);

export type ReadyUserCollectionAsyncState = UseAsyncStateReturnBase<
  IUserEmoteCollection,
  [strategy: "get" | "refresh" | "refresh-integration"],
  true
>;
</script>
