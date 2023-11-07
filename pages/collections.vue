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
              collections.integrations.execute();
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
      <lazy-emote-collection-list-sync v-else-if="user" :user="user" />
    </div>
  </div>
  <!-- FIXME: make nuxt-loading-indicator work  -->
  <!-- to make it work must use useFetch -->
  <!-- <nuxt-loading-indicator />  -->
</template>
<script lang="ts" setup>
import type { IUserEmoteCollection } from "~/integrations";
/* eslint-disable no-console */

useHead({ title: "collections - pastbl" });

const nickname = useUrlQueryParam("nickname");
const mustShowInput = nickname.value === "";
const collections = useUserIntegrations(nickname);

const user = ref<IUserEmoteCollection>();

onErrorCaptured((error) => {
  // TODO: here can check instanceof error
  // if extended error then put at least toast
  process.dev && console.log({ error, captured: true });
});

onMounted(async () => {
  if (!nickname.value.length) {
    throw new Error("Must enter a nickname");
  }
  const { openDBs } = await import("~/client-only/IndexedDB");
  const dbs = await openDBs();
  const loadStrategy = ref<"fromIDB" | "fromAPI" | null>(null);
  const idbUser = await dbs.collectionsDB.get(
    "users",
    nickname.value.toLowerCase() as Lowercase<string>,
  );
  if (idbUser) {
    loadStrategy.value = "fromIDB";
    const { getProperUserCollectionFromIDB } = await import(
      "~/client-only/IndexedDB"
    );
    user.value = await getProperUserCollectionFromIDB(dbs.emotesDB, idbUser);
  } else {
    loadStrategy.value = "fromAPI";
    const { putUserEmotesToDB, putUserToDB } = await import(
      "~/client-only/IndexedDB"
    );
    user.value =
      (await collections.integrations.execute()) ||
      raise("Failed to load emote collection");
    putUserToDB(dbs.collectionsDB, toRaw(user.value));
    putUserEmotesToDB(dbs.emotesDB, toRaw(user.value));
  }
  process.dev && console.log({ user: user.value });
});
</script>
