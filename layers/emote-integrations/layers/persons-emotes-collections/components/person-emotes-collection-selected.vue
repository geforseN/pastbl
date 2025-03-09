<template>
  <div v-if="selectedCollection">
    <span class="px-2 font-bold">{{ $t("collections.users.selected") }}</span>
    <person-emotes-collection-chip
      class="border-twitch-accent border-2"
      :nickname="selectedCollection.person.twitch.nickname"
      :avatar-url="selectedCollection.person.twitch.avatarUrl"
      :is-selected="true"
      :is-refreshing="
        personsCollectionsStore.isCollectionLoading(selectedCollection)
      "
      :login="selectedCollection.person.twitch.login"
      :formed-at="selectedCollection.formedAt"
      @delete="personsCollectionsStore.deleteCollection(selectedCollection)"
      @refresh="personsCollectionsStore.loadCollection(selectedCollection)"
      @unselect="personsCollectionsStore.unselectCollection"
    />
  </div>
</template>
<script setup lang="ts">
const personsCollectionsStore = usePersonsEmoteCollectionsStore();

const selectedCollection = computed(
  () => personsCollectionsStore.selectedCollection.state,
);
</script>
