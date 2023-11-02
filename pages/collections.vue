<template>
  <div>
    <div
      class="my-2 flex flex-col items-center justify-center gap-4 md:flex-row md:items-start"
    >
      <div
        class="flex w-full max-w-sm flex-col items-center gap-2 rounded border border-base-content bg-black/10 p-2"
      >
        <emote-collection-fetch-input-group
          v-if="shouldShowInput"
          v-model:nickname="nickname"
          class="-mt-2"
          :is-collections-loading="collections.integrations.isLoading.value"
          @load-collections="
            () => {
              if (collections.integrations.isLoading.value) {
                return;
              }
              collections.integrations.execute();
            }
          "
        />
        <emote-collection-user-loaded-data
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
      to cancel image loading src attribute of img should be set to empty string => <img src="" alt="any " />
     -->
      <emote-collection-list
        v-if="collections.integrations.state.value"
        :collections="collections"
      />
      <emote-collection-list-sync v-else-if="user" :user="user" />
    </div>
  </div>
  <!-- FIXME: make nuxt-loading-indicator work  -->
  <!-- to make it work should use useFetch -->
  <!-- <nuxt-loading-indicator />  -->
</template>
<script lang="ts" setup>
import type { IUserEmoteCollection } from "~/integrations";
/* eslint-disable no-console */

useHead({ title: "collections - pastbl" });

const nickname = useUrlQueryParam("nickname");
const shouldShowInput = nickname.value === "";
const collections = useUserIntegrations(nickname);

const user = ref<IUserEmoteCollection>();

onErrorCaptured((error) => {
  // TODO: here can check instanceof error
  // if extended error then put at least toast
  console.log({ error, captured: true });
});

onMounted(async () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const userStore = useUserStore();

  if (!nickname.value.length) {
    throw new Error("Must enter a nickname");
  }

  const { openDBs } = await import("~/client-only/IndexedDB");
  const dbs = await openDBs();

  const idbUser = await dbs.collectionsDB.get(
    "users",
    nickname.value.toLowerCase() as Lowercase<string>,
  );
  if (idbUser) {
    const { getProperUserCollectionFromIDB } = await import(
      "~/client-only/IndexedDB"
    );
    user.value = await getProperUserCollectionFromIDB(dbs.emotesDB, idbUser);
  } else {
    const { putUserEmotesToDB, putUserToDB } = await import(
      "~/client-only/IndexedDB"
    );
    user.value =
      (await collections.integrations.execute()) ||
      raise("Failed to load emote collection");
    putUserToDB(dbs.collectionsDB, toRaw(user.value));
    putUserEmotesToDB(dbs.emotesDB, toRaw(user.value));
  }

  console.log({ user: user.value });
});
</script>
