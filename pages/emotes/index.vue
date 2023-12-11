<template>
  <div class="flex flex-col gap-2">
    <div class="rounded-box border-2 px-4 py-2">
      <nuxt-link to="/emotes/global">
        <span
          class="flex items-center justify-between gap-2 text-3xl font-bold"
        >
          <span class="flex items-center gap-2">
            <icon name="carbon:link" />
            Look for global emotes
          </span>
        </span>
      </nuxt-link>
    </div>
    <div class="rounded-box border-2 px-4 py-2">
      <nuxt-link to="/emotes/active">
        <span
          class="flex items-center justify-between gap-2 text-3xl font-bold"
        >
          <span class="flex items-center gap-2">
            <icon name="carbon:link" />
            Select active emotes
          </span>
        </span>
      </nuxt-link>
    </div>
    <section class="rounded-box border-2 p-2">
      <h2 class="-mb-1 p-1 text-3xl font-bold">Load user collection</h2>
      <div class="join p-1">
        <input
          id="nickname"
          v-model="nickname"
          name="nickname"
          placeholder="Enter twitch nickname"
          class="input join-item input-secondary grow"
          type="text"
        />
        <button class="btn btn-secondary join-item" @click="hg">
          Load collection
        </button>
      </div>
    </section>
    <go-to-main-page />
  </div>
</template>
<script setup lang="ts">
const userCollectionsStore = useUserCollectionsStore();

const collections = useUserIntegrations();

const nickname = ref("");

async function hg() {
  if (
    !nickname.value ||
    userCollectionsStore.usernamesToSelect.state.some(
      (name) => name.toLowerCase() === nickname.value.toLowerCase(),
    )
  ) {
    return;
  }
  const [emoteCollectionsIdb, emotesIdb] = await import(
    "~/client-only/IndexedDB"
  ).then(({ idb }) => Promise.all([idb.emoteCollections, idb.emotes]));

  const collection =
    (await collections.integrations.execute(0, nickname)) ||
    raise("Failed to load emote collection");

  await Promise.all([
    emoteCollectionsIdb.users.putCollection(collection),
    emotesIdb.putEmotesOfUserCollection(collection),
  ]);
  // TODO: add collection in store
  // NOTE: 'collection' already is filled with emotes
}
</script>
