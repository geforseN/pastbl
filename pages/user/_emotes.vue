<template>
  <div class="flex flex-col gap-2">
    <global-emotes />

    <div class="rounded-box border-2 p-2">
      <section class="p-2">
        <label for="active-user-collection">
          <h2 class="text-3xl font-bold">Select active user collection</h2>
        </label>
        <select
          id="active-user-collection"
          ref="userEmoteCollectionSelectRef"
          name="active-user-collection"
          class="select select-secondary mt-1 w-full"
          :disabled="userCollectionsStore.selectedCollectionUsername.isLoading"
          @input="handleSelectInput"
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
      </section>
      <selected-user-collection
        :collection="userCollectionsStore.selectedCollection"
        :is-collection-selected="true"
      />
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

const userEmoteCollectionSelectRef = ref<HTMLSelectElement>();

async function handleSelectInput(event: Event) {
  await userCollectionsStore.selectedCollectionUsername.execute(
    0,
    (event.currentTarget as HTMLSelectElement).value,
  );
  userEmoteCollectionSelectRef.value?.focus();
}

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
