<template>
  <div v-auto-animate class="space-y-1">
    <emote-collection-person-chip
      v-for="collection of userCollectionsStore.collectionsToSelect.state"
      :key="collection.user.twitch.login"
      class="border border-base-content"
      :formed-at="collection.formedAt"
      :login="collection.user.twitch.login"
      :nickname="collection.user.twitch.nickname"
      :avatar-url="collection.user.twitch.avatarUrl"
      :is-selected="userCollectionsStore.isCollectionSelected(collection)"
      :is-refreshing="userCollectionsStore.isCollectionLoading(collection)"
      @delete="userCollectionsStore.deleteCollection(collection)"
      @refresh="userCollectionsStore.loadCollection(collection)"
      @select="userCollectionsStore.selectCollection(collection)"
    />
  </div>
</template>
<script setup lang="ts">
const userCollectionsStore = useUserCollectionsStore();
</script>
