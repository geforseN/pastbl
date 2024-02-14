<template>
  <div class="w-96">
    <div v-if="collection.state.value !== null" class="flex flex-col gap-2">
      <user-collection-ready
        v-if="collection.state.value !== null"
        :async-state="collection as ReadyUserCollectionAsyncState"
        :is-collection-selected="userCollectionsStore.isSelectedLogin(login)"
        @delete="
          async () => {
            await userCollectionsStore.deleteCollection(login);
            if ($route.path.endsWith(`/collections/users/${login}`)) {
              await $router.push({
                path: '/collections',
                hash: '#heading',
              });
            }
          }
        "
        @refresh="collection.execute(0, 'refresh')"
        @select="userCollectionsStore.selectCollection(login)"
        @refresh-integration="
          (integration) =>
            collection.execute(0, 'refresh-integration', integration)
        "
      />
      <app-page-link to="emotes">
        <template #right><emote-integration-logos /></template>
      </app-page-link>
      <app-page-link to="main" />
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
import type {
  IUserEmoteCollection,
  IUserEmoteIntegration,
} from "~/integrations";

const isError = (value: unknown): value is Error => value instanceof Error;

const { nickname } = useRoute().params;
assert.ok(typeof nickname === "string", "Page param nickname must be a string");
const login = toLowerCase(nickname);

const userCollectionsStore = useUserCollectionsStore();

const collection = useAsyncState(
  async (
    strategy: "get" | "refresh" | "refresh-integration",
    newIntegration?: IUserEmoteIntegration,
  ) => {
    if (typeof window === "undefined") {
      return null;
    }
    switch (strategy) {
      case "get": {
        const collection_ = await userCollectionsService.get(login);
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
  { shallow: true, immediate: false, resetOnExecute: false },
);

collection.execute(0, "get");

export type ReadyUserCollectionAsyncState = UseAsyncStateReturnBase<
  IUserEmoteCollection,
  [strategy: "get" | "refresh"],
  true
>;
</script>
