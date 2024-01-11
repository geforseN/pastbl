<template>
  <section class="rounded-box border-2 p-2">
    <h2 class="p-2 text-3xl font-bold">Users collections</h2>
    <div v-auto-animate class="flex max-h-72 flex-col gap-2 overflow-auto">
      <user-emote-collection-btnlike
        v-for="collection of userCollectionsStore.collectionsToSelect.state"
        :key="collection.twitch.nickname"
        class="rounded-btn border-2 p-2"
        :class="
          userCollectionsStore.isSelectedUsername(collection.twitch.username) &&
          'border-twitch'
        "
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
  </section>
</template>
<script setup lang="ts">
const userCollectionsStore = useUserCollectionsStore();
</script>
