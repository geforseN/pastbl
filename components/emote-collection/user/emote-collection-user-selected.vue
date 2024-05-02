<template>
  <div v-if="selected">
    <span class="px-2 font-bold">{{ $t("collections.users.selected") }}</span>
    <emote-collection-user-chip
      class="border-2 border-twitch-accent"
      :nickname="selected.user.twitch.nickname"
      :avatar-url="selected.user.twitch.avatarUrl"
      :is-selected="true"
      :is-refreshing="userCollectionsStore.isCollectionLoading(selected)"
      :login="selected.user.twitch.login"
      :formed-at="selected.formedAt"
      @delete="userCollectionsStore.deleteCollection(selected)"
      @refresh="userCollectionsStore.loadCollection(selected)"
      @unselect="userCollectionsStore.unselectCollection"
    />
  </div>
</template>
<script setup lang="ts">
const userCollectionsStore = useUserCollectionsStore();

const selected = computed(() => userCollectionsStore.selectedCollection.state);
</script>
