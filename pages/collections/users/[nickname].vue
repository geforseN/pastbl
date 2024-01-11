<template>
  <div>
    <div v-if="collection.isLoading.value">Loading...</div>
    <div v-else-if="collection.error.value">
      {{
        collection.error.value?.message ||
        `Failed to load user collection with username: ${username}`
      }}
    </div>
    <div
      v-else-if="collection.isReady.value && collection.state.value"
      class="flex flex-col gap-2"
    >
      <ready-user-collection
        :collection="{
          ...collection.state.value,
          isSelected:
            userCollectionsStore.selectedCollectionUsername.state === username,
        }"
        @delete="userCollectionsStore.deleteCollection(username)"
        @refresh="userCollectionsStore.refreshCollection(username)"
        @select="userCollectionsStore.selectCollection(username)"
      />
      <app-page-link to="emotes">
        <template #right><emote-integration-logo-square /></template>
      </app-page-link>
      <app-page-link to="main" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { userCollectionsService } from "~/client-only/services";

const { nickname } = useRoute().params;
assert.ok(typeof nickname === "string", "Page param nickname must be a string");
const username = toLowerCase(nickname);

const userCollectionsStore = useUserCollectionsStore();

const collection = useAsyncState(
  async () => {
    if (typeof window === "undefined") {
      return null;
    }
    const userCollection = await userCollectionsService.get(username);
    assert.ok(userCollection, `No collection found with username: ${username}`);
    return userCollection;
  },
  null,
  { shallow: true },
);
</script>
