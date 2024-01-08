<template>
  <div v-auto-animate class="flex max-h-72 flex-col gap-2 overflow-y-scroll">
    <user-emote-collection-btnlike
      v-for="collection of userCollectionsStore.collectionsToSelect.state"
      :key="collection.twitch.nickname"
      class="rounded-btn border-2 p-2"
      :nickname="collection.twitch.nickname"
      :avatar-url="collection.integrations.FrankerFaceZ?.owner.avatarUrl"
      @delete="
        userCollectionsStore.deleteCollection(collection.twitch.username)
      "
      @refresh="
        userCollectionsStore.refreshCollection(collection.twitch.username)
      "
    />
  </div>
</template>
<script setup lang="ts">
const userCollectionsStore = useUserCollectionsStore();
</script>
