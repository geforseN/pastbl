<template>
  <div v-auto-animate class="space-y-1">
    <emote-collection-user-chip
      v-for="collection of userCollectionsStore.collectionsToSelect.state"
      :key="collection.user.twitch.login"
      class="border border-base-content"
      :updated-at="collection.updatedAt"
      :login="collection.user.twitch.login"
      :nickname="collection.user.twitch.nickname"
      :avatar-url="collection.user.twitch.avatarUrl"
      :is-selected="userCollectionsStore.isCollectionSelected(collection)"
      :is-refreshing="userCollectionsStore.isCollectionRefreshing(collection)"
      @delete="userCollectionsStore.deleteCollection(collection)"
      @refresh="userCollectionsStore.refreshCollection(collection)"
      @select="userCollectionsStore.selectCollection(collection)"
    />
  </div>
</template>
<script setup lang="ts">
const userCollectionsStore = useUserCollectionsStore();
</script>
