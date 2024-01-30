<template>
  <section class="rounded-box border-2 p-2">
    <h2 class="p-2 text-3xl font-bold">Users collections</h2>
    <div v-auto-animate class="flex max-h-72 flex-col gap-2 overflow-auto">
      <user-collection-btnlike
        v-for="collection of userCollectionsStore.collectionsToSelect.state"
        :key="collection.user.twitch.login"
        class="rounded-btn border-2 p-2"
        :class="
          userCollectionsStore.isSelectedLogin(collection.user.twitch.login) &&
          'border-twitch'
        "
        :nickname="collection.user.twitch.login"
        :avatar-url="collection.user.twitch.avatarUrl"
        @delete="
          userCollectionsStore.deleteCollection(collection.user.twitch.login)
        "
        @refresh="
          userCollectionsStore.loadCollection(collection.user.twitch.login)
        "
      />
    </div>
  </section>
</template>
<script setup lang="ts">
const userCollectionsStore = useUserCollectionsStore();
</script>
