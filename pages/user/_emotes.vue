<template>
  <div class="flex flex-col gap-2">
    <global-emotes />
    <div class="rounded-box border-2 p-2">
      <label for="active-user-collection">Select active user collection</label>
      <div class="flex flex-col">
        <span
          >state:
          {{ userCollectionsStore.selectedCollectionUsername.state }}
          {{ typeof userCollectionsStore.selectedCollectionUsername.state }}
        </span>
        <span
          >error:
          {{ userCollectionsStore.selectedCollectionUsername.error }}
        </span>
        <span
          >isLoading:
          {{ userCollectionsStore.selectedCollectionUsername.isLoading }}
        </span>
        <span
          >isReady:
          {{ userCollectionsStore.selectedCollectionUsername.isReady }}
        </span>
      </div>

      <select
        id="active-user-collection"
        name="active-user-collection"
        class="select select-secondary"
        :disabled="userCollectionsStore.selectedCollectionUsername.isLoading"
        :class="[
          userCollectionsStore.selectedCollectionUsername.isLoading &&
            'skeleton rounded-btn',
        ]"
        @change="
          (event) => {
            userCollectionsStore.selectedCollectionUsername.execute(
              3_000,
              (event.target as HTMLSelectElement).value,
            );
          }
        "
      >
        <option value="" />
        <option
          v-for="name of userCollectionsStore.usernamesToSelect.state"
          :key="name"
          :value="name"
          :selected="
            name === userCollectionsStore.selectedCollectionUsername.state
          "
        >
          {{ name }}
        </option>
      </select>
    </div>
    <div>
      selectedUserCollections
      <div class="flex flex-col">
        <span>
          nickname:
          {{ userCollectionsStore.selectedCollection.state?.twitch?.nickname }}
        </span>
        <span>
          typeof state:
          {{ typeof userCollectionsStore.selectedCollection.state }}
        </span>
        <span>error: {{ userCollectionsStore.selectedCollection.error }}</span>
        <span
          >isLoading:
          {{ userCollectionsStore.selectedCollection.isLoading }}
        </span>
        <span
          >isReady: {{ userCollectionsStore.selectedCollection.isReady }}
        </span>
      </div>
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
