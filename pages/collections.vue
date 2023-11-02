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
      <ol class="flex w-full flex-col gap-1 xs:w-96 2xl:w-auto 2xl:flex-row">
        <emote-collection-ffz
          class="min-h-16 2xl:h-max 2xl:w-80"
          :ffz="collections.ffz"
        />
        <emote-collection-bttv
          class="min-h-16 2xl:h-max 2xl:w-80"
          :bttv="collections.bttv"
        />
        <emote-collection-seventv
          class="min-h-16 2xl:h-max 2xl:w-80"
          :seven-tv="collections.sevenTv"
        />
      </ol>
    </div>
  </div>
  <!-- FIXME: make nuxt-loading-indicator work  -->
  <!-- to make it work should use useFetch -->
  <!-- <nuxt-loading-indicator />  -->
</template>
<script lang="ts" setup>
import { EmoteCollection } from "~/integrations/EmoteCollection";
/* eslint-disable no-console */

useHead({ title: "collections - pastbl" });

const nickname = useUrlQueryParam("nickname");
const shouldShowInput = nickname.value === "";
const collections = useUserIntegrations(nickname);

const userStore = useUserStore();

const user = ref();

onErrorCaptured((error) => {
  // TODO: here can check instanceof error
  // if extended error then put at least toast
  console.log({ error, captured: true });
});

onMounted(async () => {
  const { openUserEmoteCollectionsDB, putUserEmotesToDB, putUserProfileToDB } =
    await import("~/client-only/IndexedDB");
  const { createUserEmotesForIDB, createUserProfileForIDB } = await import(
    "~/client-only/IndexedDB/UserProfileCollections"
  );
  if (nickname.value.length) {
    await collections.integrations.execute();
  }
  console.log({ collections });

  const db = await openUserEmoteCollectionsDB();
  const userFromStore = await db.get("profiles", nickname.value);
  if (userFromStore) {
    user.value = userFromStore;
    const emotesIDBStore = db.transaction("emotes").store;

    console.time("fromIDBCollection");
    const fromIDBCollection = await Promise.all(
      Object.values(userFromStore.collections).map((idbCollection) =>
        EmoteCollection.fromIDBCollection2(idbCollection, (emoteId) =>
          emotesIDBStore.get([emoteId, idbCollection.source]),
        ),
      ),
    );

    console.timeEnd("fromIDBCollection");

    console.log({
      fromIDBCollection,
    });
    return;
  }
  console.log("no such user found in idb store");
  // const allUserEmotes = createUserEmotesForIDB(userCollections);
  // const userProfile = createUserProfileForIDB(userCollections);
  // console.log({ allUserEmotes, userProfile });
  // const result = await Promise.all([
  //   putUserProfileToDB(userProfile, db),
  //   putUserEmotesToDB(allUserEmotes, db),
  // ]);
  // return console.log({
  //   state2: collections.integrations.state.value,
  //   result,
  // });
});
</script>

<!-- 

    // console.time("collectionsFromIDB");
    // const collectionsFromIDB = Object.values(userFromStore.collections).map(
    //   (collection) => {
    //     return {
    //       ...collection,
    //       sets: collection.sets.map((setLike) =>
    //         toSet(setLike, (emoteId) =>
    //           emotesIDBStore.get([emoteId, setLike.name as Integration]),
    //         ),
    //       ),
    //     };
    //   },
    // );
    // console.timeEnd("collectionsFromIDB");

    // console.time("populatedCollections");
    // const populatedCollections = await Promise.all(
    //   Object.values(userFromStore.collections).map(async (collection) => {
    //     return {
    //       ...collection,
    //       sets: await Promise.all(
    //         collection.sets.map(async (set) => ({
    //           id: set.id,
    //           name: set.name,
    //           source: set.source,
    //           updatedAt: set.updatedAt,
    //           emotes: await Promise.all(
    //             set.emoteIds.map((id) =>
    //               emotesIDBStore.get([id, set.name as Integration]),
    //             ),
    //           ),
    //         })),
    //       ),
    //     };
    //   }),
    // );
    // console.timeEnd("populatedCollections");


    // console.time("emotes");
    // const emotes = await Promise.all(
    //   Object.values(collectionsFromIDB).map((collection) =>
    //     Promise.all(collection.sets.map((set) => Promise.all(set.emotes))),
    //   ),
    // );
    // console.timeEnd("emotes");

 -->
