<template>
  <div class="my-2 flex w-full items-start justify-center gap-4">
    <div
      class="flex w-96 flex-col items-center gap-2 rounded border border-base-content bg-black/10 p-2"
    >
      <emote-collection-fetch-input-group
        v-if="shouldShowInput"
        v-model:nickname="nickname"
        class="-mt-2"
        :is-collections-loading="collections.fetch.isLoading.value"
        @load-collections="
          () => {
            if (collections.fetch.isLoading.value) {
              return;
            }
            collections.fetch.execute();
          }
        "
      />
      <emote-collection-user-loaded-data
        class="w-full"
        :collections="collections"
      />
      <div
        v-if="collections.fetch.isReady.value"
        class="flex w-full justify-end gap-2"
      >
        <button class="btn btn-success" @click="handleSave">Save</button>
        <div
          class="tooltip tooltip-info before:border before:border-current before:p-2 before:text-base"
          data-tip="You can use collection only if you saved it"
        >
          <button
            v-if="collections.fetch.isReady.value"
            class="btn btn-success"
            :disabled="
              userStore.user.selectedEmoteCollection?.name !== nickname
            "
          >
            Use
          </button>
        </div>
      </div>
      <span v-if="collections.fetch.error.value" class="text-error">
        {{ collections.fetch.error.value }}
      </span>
      <!-- TODO: make below form control work: user should enter user twitch id and then we fetch bttv and 7tv -->
      <div
        v-if="
          collections.fetch.error.value &&
          typeof collections.fetch.error.value === 'object' &&
          collections.fetch.error.value !== null &&
          'message' in collections.fetch.error.value &&
          typeof collections.fetch.error.value.message === 'string' &&
          collections.fetch.error.value.message.includes(
            'FrankerFaceZ does not have user with nickname',
          )
        "
        class="form-control w-full"
      >
        <label class="label" for="user-twitch-id">Enter user Twitch id</label>
        <input
          id="user-twitch-id "
          class="input w-full border-twitch"
          type="number"
          placeholder="User Twitch id, must be number"
        />
      </div>
    </div>
    <!-- NOTE: 
      when user goes to another site page,
      images from emote collections still can be in loading state
      to cancel image loading src attribute of img should be set to empty string => <img src="" alt="any " />
     -->
    <ol class="flex w-96 flex-col gap-1 2xl:w-auto 2xl:flex-row">
      <emote-collection-ffz
        class="min-h-16 2xl:h-max 2xl:w-80"
        :ffz="collections.ffz"
        :ffz-room="collections.ffzRoom"
      />
      <emote-collection-bttv
        class="min-h-16 2xl:h-max 2xl:w-80"
        :bttv="collections.bttv"
      />
      <emote-collection-seventv
        class="min-h-16 2xl:h-max 2xl:w-80"
        :seventv="collections.sevenTv"
        :seventv-set="collections.sevenTvSet"
      />
    </ol>
  </div>
</template>

<script lang="ts" setup>
import {
  type EmoteCollectionWithSetsLike,
  type ProfileT,
} from "~/client-only/IndexedDB/UserProfileCollections";
import type { Emote, EmoteCollection } from "~/integrations";

useHead({ title: "collections - pastbl" });

const nickname = useUrlQueryParam("nickname");
const shouldShowInput = nickname.value === "";
const collections = useAsyncEmotesState(nickname);

const userStore = useUserStore();

const user = ref();

onMounted(async () => {
  const { openUserEmoteCollectionsDB, putUserEmotesToDB, putUserProfileToDB } =
    await import("~/client-only/IndexedDB");
  const { createUserEmotes, createUserProfile } = await import(
    "~/client-only/IndexedDB/UserProfileCollections"
  );

  if (nickname.value) {
    collections.fetch.execute();
  }
  const db = await openUserEmoteCollectionsDB();
  const userFromStore = await db.get("profiles", nickname.value);

  if (userFromStore) {
    user.value; // FIXME - here put value from idb to user ref
    // isLoading can be true in ssr mode (if user made GET request of this page instead of vue-router)
    // we can use this to update userFromStore with more new data
    if (collections.fetch.isLoading.value) {
      await until(collections.fetch.isReady).toBe(true, {
        timeout: 30_000,
        throwOnTimeout: true,
      });
      // HERE need to map all this collection properties below
      collections.ffz;
      collections.ffzRoom;
      collections.bttv;
      collections.sevenTv;
      collections.sevenTvSet;
      // AND THEN HERE put new value to store and set user ref to new value
      // db.put('users')
      // db.put('collections')
      // db.put('sets')
      // db.put('emotes')
      user.value =
        userFromStore; /* here need set new value, not userFromStore */
    }
    return;
  }
  if (collections.fetch.isReady.value) {
    return console.log({ state1: collections.fetch.state.value });
    // map fetched data and save it
  }
  await until(collections.fetch.isReady).toBe(true, {
    timeout: 30_000,
    throwOnTimeout: true,
  });
  const userCollections = collections.fetch.state.value;
  if (!userCollections) {
    throw 1;
  }

  const allUserEmotes = createUserEmotes(userCollections);
  const userProfile = createUserProfile(userCollections);
  console.log({ data, userProfile });
  const result = await putUserEmotesToDB(allUserEmotes, db);
  return console.log({
    state2: collections.fetch.state.value,
    result,
  });

  // NOW CAN ADD MAPPED COLLECTION TO STORE

  // when collections loaded
  //   => save to IndexedDB
  //
});
</script>
<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!--  -->
<!-- 
  export interface EmoteCollectionDB extends DBSchema {
  "@@global": any;
  saved: any;
}
 -->

<!-- 

onMounted(async () => {
  return
  const db = await openDB<EmoteCollectionDB>("emote-collections", 1, {
    upgrade(db) {
      db.createObjectStore("saved", {
        keyPath: "nickname",
      });
      db.createObjectStore("@@global", {
        keyPath: "name",
      });
    },
  });
  console.log(await db.getAll("@@global"));

  try {
    const [fulfilledCollections, rejectReasons] = tupleSettledPromises(
      await Promise.allSettled([
        getBetterTTVGlobalEmotes().then((bttvEmotes) => {
          console.log({ bttvEmotes });
          return createBTTVGlobalCollection(bttvEmotes);
        }),
        getFFZGlobalEmoteSets().then((ffzSets) => {
          console.log({ ffzSets });
          return createFFZGlobalCollection(ffzSets);
        }),
        Promise.all([
          sevenTVApi.globalHalloweenEmotesSet(),
          sevenTVApi.globalEmotesSet(),
        ]).then((sevenTVSets) => {
          console.log({ sevenTVSets });
          return create7TVGlobalCollection(sevenTVSets);
        }),
      ]),
    );
    fulfilledCollections.forEach((collections) => {});
  } catch {}
});


 -->

<!-- 

async function handleSave() {
  const { SevenTVCollection, SevenTVEmote, SevenTVSet } = await import(
    "~/integrations/SevenTV/SevenTV.client"
  );
  const { FFZCollection, FFZEmote, FFZEmoteSet } = await import(
    "~/integrations/FrankerFaceZ/FrankerFaceZ.client"
  );
  const { BTTVCollection, BTTVEmote, BTTVSet } = await import(
    "~/integrations/BetterTTV/BetterTTV.client"
  );

  if (
    !collections.ffzRoom.state.value?.sets ||
    !collections.bttv.state.value ||
    !collections.seventvSet.state.value
  ) {
    throw 1;
  }
  const ffzSets = Object.values(collections.ffzRoom.state.value.sets).map(
    (apiSet) =>
      new FFZEmoteSet(apiSet, (apiEmote) => new FFZEmote(apiEmote, "global")),
  );
  const ffzCollection = new FFZCollection(ffzSets);

  const bttvSets = [
    {
      name: "Shared BetterTTV emotes",
      emotes: collections.bttv.state.value.sharedEmotes,
    },
    {
      name: "Channel BetterTTV emotes",
      emotes: collections.bttv.state.value.channelEmotes,
    },
  ]
    .filter((record) => record.emotes.length)
    .map(
      (record) =>
        new BTTVSet(
          {
            ...record,
            id: `bttv::${record.name.toLowerCase()}`,
          },
          (emote) =>
            new BTTVEmote(
              emote,
              record.name.includes("Channel") ? "channel" : "shared",
            ),
        ),
    );

  const bttvCollection = new BTTVCollection(bttvSets);

  const sevenTVSets = [
    new SevenTVSet(
      collections.seventvSet.state.value,
      (emote) => new SevenTVEmote(emote),
    ),
  ];
  const sevenTVCollection = new SevenTVCollection(sevenTVSets);

  if (!DB.value) {
    throw 2;
  }
  console.log({
    ffzCollection,
    bttvCollection,
    sevenTVCollection,
  });
  [ffzCollection, bttvCollection, sevenTVCollection].forEach((collection) =>
    DB.value!.add("saved", collection),
  );
}

 -->
