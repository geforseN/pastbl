<template>
  <section class="rounded-box border-2 p-2">
    <div class="flex p-2 pb-0">
      <h2 class="text-3xl font-bold">Load user collection&nbsp;</h2>
      <emote-integration-logo-square />
    </div>
    <div class="-mt-1.5">
      <div class="join p-1">
        <input
          id="nickname"
          v-model="nickname"
          name="nickname"
          placeholder="Enter twitch nickname"
          class="input join-item input-accent grow"
          type="text"
        />
        <button
          class="btn btn-accent join-item"
          @click="loadCollection(nickname)"
        >
          Load collection
        </button>
      </div>
    </div>
    <div v-auto-animate class="flex flex-col gap-2">
      <loading-user-emote-collection-btnlike
        v-for="collection of userCollectionsStore.loadingCollections"
        :key="collection.username"
        :collection="collection"
      />
    </div>
  </section>
</template>
<script lang="ts" setup>
const nickname = ref("");

const userCollectionsStore = useUserCollectionsStore();

const toast = useNuxtToast();

async function loadCollection(nickname: string) {
  try {
    await userCollectionsStore.loadCollection(nickname);
  } catch (error) {
    assert.isError(error, ExtendedError);
    toast.add(error);
  }
}
</script>
