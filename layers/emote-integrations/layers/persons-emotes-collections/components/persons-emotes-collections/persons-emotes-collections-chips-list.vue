<template>
  <div v-auto-animate class="space-y-1">
    <person-emotes-collection-chip
      v-for="collection of personsEmoteCollections.collectionsToSelect.state"
      :key="collection.person.twitch.login"
      class="border border-base-content"
      :formed-at="collection.formedAt"
      :login="collection.person.twitch.login"
      :nickname="collection.person.twitch.nickname"
      :avatar-url="collection.person.twitch.avatarUrl"
      :is-selected="personsEmoteCollections.isCollectionSelected(collection)"
      :is-refreshing="personsEmoteCollections.isCollectionLoading(collection)"
      @delete="personsEmoteCollections.deleteCollection(collection)"
      @refresh="personsEmoteCollections.loadCollection(collection)"
      @select="personsEmoteCollections.selectCollection(collection)"
    />
  </div>
</template>
<script setup>
const personsEmoteCollections = usePersonsEmoteCollectionsStore();
</script>
