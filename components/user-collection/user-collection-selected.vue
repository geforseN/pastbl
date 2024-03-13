<template>
  <div v-if="selectedCollection">
    <span class="px-2 font-bold">{{ $t("collections.users.selected") }}</span>
    <user-collection-chip
      class="rounded-btn border-2 border-twitch-accent p-2"
      :nickname="selectedCollection.user.twitch.nickname"
      :avatar-url="selectedCollection.user.twitch.avatarUrl"
      :is-selected="true"
      :login="selectedCollection.user.twitch.login"
      :updated-at="selectedCollection.updatedAt"
      @delete="
        userCollectionsStore.deleteCollection(
          selectedCollection.user.twitch.login,
        )
      "
      @refresh="
        userCollectionsStore.loadCollection(
          selectedCollection.user.twitch.login,
        )
      "
    />
  </div>
</template>
<script setup lang="ts">
const userCollectionsStore = useUserCollectionsStore();

const selectedCollection = computed(
  () => userCollectionsStore.selectedCollection.state,
);
</script>
