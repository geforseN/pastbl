<template>
  <div v-if="!selectedCollection" class="p-2 font-bold">
    No user collection selected
  </div>
  <div v-else class="mt-2">
    <span class="px-2 font-bold">Selected user collection:</span>
    <user-emote-collection-btnlike
      class="rounded-btn border-2 border-twitch p-2"
      :nickname="selectedCollection.user.twitch.nickname"
      :avatar-url="selectedCollection.user.twitch.avatarUrl"
      @delete="userCollectionsStore.deleteCollection(selectedCollectionLogin)"
      @refresh="userCollectionsStore.loadCollection(selectedCollectionLogin)"
    />
  </div>
</template>
<script setup lang="ts">
const userCollectionsStore = useUserCollectionsStore();

const selectedCollection = computed(
  () => userCollectionsStore.selectedCollection.state,
);

const selectedCollectionLogin = computed(
  () => selectedCollection.value?.user.twitch.login || "",
);
</script>
