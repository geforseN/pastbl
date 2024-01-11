<template>
  <section class="rounded-box border-2 p-2">
    <div class="flex justify-between p-2">
      <h2 class="text-3xl font-bold">Load user collection&nbsp;</h2>
      <emote-integration-logo-square />
    </div>
    <div class="join">
      <input
        id="nickname"
        v-model="nicknameToLoad"
        name="nickname"
        placeholder="Enter twitch nickname"
        class="input join-item input-accent grow"
        type="text"
        @keyup.enter="loadCollection()"
      />
      <button class="btn btn-accent join-item" @click="loadCollection()">
        Load collection
      </button>
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
const nicknameToLoad = ref("");

const userCollectionsStore = useUserCollectionsStore();

const toast = useNuxtToast();

async function loadCollection() {
  try {
    const collectionPromise = userCollectionsStore.loadCollection(
      nicknameToLoad.value,
    );
    nicknameToLoad.value = "";
    await collectionPromise;
  } catch (error) {
    assert.isError(error, ExtendedError);
    toast.add(error);
  }
}
</script>
