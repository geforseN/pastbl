<template>
  <div v-auto-animate class="flex flex-col gap-1">
    <user-collection-chip
      v-for="collection of userCollectionsStore.collectionsToSelect.state"
      :key="collection.user.twitch.login"
      :updated-at="collection.updatedAt"
      :login="collection.user.twitch.login"
      :nickname="collection.user.twitch.nickname"
      :avatar-url="collection.user.twitch.avatarUrl"
      :is-selected="
        userCollectionsStore.isSelectedLogin(collection.user.twitch.login)
      "
      @delete="
        userCollectionsStore.deleteCollection(collection.user.twitch.login)
      "
      @refresh="
        userCollectionsStore.loadCollection(collection.user.twitch.login)
      "
      @select="
        userCollectionsStore.selectCollection(collection.user.twitch.login)
      "
    />
  </div>
</template>
<script setup lang="ts">
const userCollectionsStore = useUserCollectionsStore();
</script>
