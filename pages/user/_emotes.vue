<template>
  <div class="flex flex-col gap-2">
    <global-emotes />
    <div class="rounded-box border-2 p-2">
      <label for="active-user-collection">Select active user collection</label>
      <div class="flex flex-col">
        <span
          >state:
          {{ userCollectionsStore.activeUserCollectionUsername.state }}
          {{
            typeof userCollectionsStore.activeUserCollectionUsername.state
          }}</span
        >
        <span
          >error :
          {{ userCollectionsStore.activeUserCollectionUsername.error }}</span
        >
        <span
          >isLoading:
          {{
            userCollectionsStore.activeUserCollectionUsername.isLoading
          }}</span
        >
        <span
          >isReady:
          {{ userCollectionsStore.activeUserCollectionUsername.isReady }}</span
        >
      </div>
      <select
        v-show="userCollectionsStore.usernamesToSelect.isReady"
        id="active-user-collection"
        v-model="userCollectionsStore.activeUserCollectionUsername.state"
        name="active-user-collection"
        @change="
          (event) => {
            const { value } = event.target as HTMLSelectElement;
            if (!value) {
              return;
            }
            userCollectionsStore.activeUserCollectionUsername.execute(0, value);
          }
        "
      >
        <option value="" />
        <option
          v-for="name of userCollectionsStore.usernamesToSelect.state"
          :key="name"
          :value="name"
          class="bg-red-500"
        >
          {{ name }}
        </option>
      </select>
    </div>
    <div class="flex">
      <input
        v-model="nickname"
        class="input input-secondary grow"
        type="text"
      />
      <button class="btn btn-secondary" @click="hg">Add collecn</button>
    </div>
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
