<template>
  <div>
    <div
      class="my-2 flex flex-col items-center justify-center gap-4 md:flex-row md:items-start"
    >
      <div
        class="flex w-full max-w-sm flex-col items-center gap-2 rounded border border-base-content bg-black/10 p-2"
      >
        <lazy-emote-collection-fetch-input-group
          v-if="mustShowInput"
          v-model:nickname="nickname"
          class="-mt-2"
          :is-collections-loading="collections.integrations.isLoading.value"
          @load-collections="
            () => {
              if (collections.integrations.isLoading.value) {
                return;
              }
              collections.integrations.execute(0, nickname);
            }
          "
        />
        <lazy-emote-collection-user-loaded-data
          class="w-full"
          :collections="collections"
        />
        <span v-if="collections.integrations.error.value" class="text-error">
          {{ collections.integrations.error.value }}
        </span>
      </div>
      <!-- NOTE: 
      when user goes to another site page,
      images from emote collections still can be in loading state
      to cancel image loading src attribute of img must be set to empty string => <img src="" alt="any " />
     -->
      <lazy-emote-collection-list
        v-if="collections.integrations.state.value"
        :collections="collections"
      />
      <lazy-emote-collection-list-sync
        v-else-if="collection"
        :user="collection"
      />
    </div>
  </div>
  <!-- FIXME: make nuxt-loading-indicator work  -->
  <!-- to make it work must use useFetch -->
  <!-- <nuxt-loading-indicator />  -->
</template>
<script lang="ts" setup>
import type { IUserEmoteCollection } from "~/integrations";

useHead({ title: "collections - pastbl" });

const nickname = useUrlQueryParam("nickname");
const mustShowInput = nickname.value === "";
const collections = useUserIntegrations();

const collection = ref<IUserEmoteCollection>();
const collectionsStore = useCollectionsStore();

onErrorCaptured((error) => {
  // TODO: here can check instanceof error
  // if extended error then put at least toast
  if (process.dev) {
    // eslint-disable-next-line no-console
    console.log({ error, captured: true });
  }
});

onMounted(async () => {
  if (!nickname.value.length) {
    throw new Error("Must enter a nickname");
  }
  const [emoteCollectionsIdb, emotesIdb] = await import(
    "~/client-only/IndexedDB/index"
  ).then(({ idb }) => Promise.all([idb.emoteCollections, idb.emotes]));
  const loadStrategy = ref<"fromIDB" | "fromAPI" | null>(null);
  const username = nickname.value.toLowerCase() as Lowercase<string>;
  const idbCollection =
    await emoteCollectionsIdb.users.getUserCollectionByUsername(username);
  if (idbCollection) {
    loadStrategy.value = "fromIDB";
    collection.value =
      await emotesIdb.populateUserCollectionWithEmotes(idbCollection);
  } else {
    loadStrategy.value = "fromAPI";
    collection.value =
      (await collections.integrations.execute(0, nickname)) ||
      raise("Failed to load emote collection");
    const [idbUser] = await Promise.all([
      emoteCollectionsIdb.users.putCollection(collection.value),
      emotesIdb.putEmotesOfUserCollection(collection.value),
    ]);
    collectionsStore.usersCollectionsEntries.push([
      idbUser.twitch.nickname,
      idbUser,
    ]);
  }
  if (process.dev) {
    // eslint-disable-next-line no-console
    console.log({ user: collection.value });
  }
});
</script>
