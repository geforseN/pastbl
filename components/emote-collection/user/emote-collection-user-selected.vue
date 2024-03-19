<template>
  <div v-if="selectedCollection">
    <span class="px-2 font-bold">{{ $t("collections.users.selected") }}</span>
    <emote-collection-user-chip
      class="border-2 border-twitch-accent"
      :nickname="selectedCollection.user.twitch.nickname"
      :avatar-url="selectedCollection.user.twitch.avatarUrl"
      :is-selected="true"
      :is-refreshing="
        userCollectionsStore.isCollectionRefreshing(selectedCollection)
      "
      :login="selectedCollection.user.twitch.login"
      :updated-at="selectedCollection.updatedAt"
      @delete="userCollectionsStore.deleteCollection(selectedCollection)"
      @refresh="userCollectionsStore.refreshCollection(selectedCollection)"
    />
  </div>
</template>
<script setup lang="ts">
const userCollectionsStore = useUserCollectionsStore();

const selectedCollection = computed(
  () => userCollectionsStore.selectedCollection.state,
);
</script>
