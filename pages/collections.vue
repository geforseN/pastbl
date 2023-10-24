<template>
  <div class="my-2 flex w-full items-start justify-center gap-4">
    <div
      class="flex w-96 flex-col items-center gap-2 rounded border border-base-content bg-black/10 p-2"
    >
      <emote-collection-fetch-input-group
        class="-mt-2"
        v-if="shouldShowInput"
        v-model:nickname="nickname"
        @load-collections="
          () => {
            if (collections.fetch.isLoading.value) {
              return;
            }
            collections.fetch.execute();
          }
        "
        :is-collections-loading="collections.fetch.isLoading.value"
      />
      <emote-collection-user-loaded-data
        class="w-full"
        :collections="collections"
      />
      <div
        class="flex w-full justify-end gap-2"
        v-if="collections.fetch.isReady.value"
      >
        <button class="btn btn-success" @click="handleSave">Save</button>
        <div
          class="tooltip tooltip-info before:border before:border-current before:p-2 before:text-base"
          data-tip="You can use collection only if you saved it"
        >
          <button
            class="btn btn-success"
            v-if="collections.fetch.isReady.value"
            :disabled="
              userStore.user.selectedEmoteCollection?.name !== nickname
            "
          >
            Use
          </button>
        </div>
      </div>
      <span class="text-error" v-if="collections.fetch.error.value">
        {{ collections.fetch.error.value }}
      </span>
      <!-- TODO: make below form control work: user should enter user twitch id and then we fetch bttv and 7tv -->
      <div
        class="form-control w-full"
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
      >
        <label class="label" for="user-twitch-id">Enter user Twitch id</label>
        <input
          class="input w-full border-twitch"
          id="user-twitch-id "
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
        :seventv="collections.seventv"
        :seventv-set="collections.seventvSet"
      />
    </ol>
  </div>
</template>

<script lang="ts" setup>
import {
  createBTTVUserCollection,
  createFFZUserCollection,
  create7TVUserCollection,
} from "~/integrations";

useHead({ title: "collections - pastbl" });

const nickname = useUrlQueryParam("nickname");
const shouldShowInput = nickname.value === "";
const collections = useAsyncEmotesState(nickname);

const userStore = useUserStore();

if (false && nickname.value) {
  collections.fetch.execute();
}

const user = ref();

onMounted(async () => {
  const { openUserEmoteCollectionsDB, getMappedEmotesFromIdb } = await import(
    "~/client-only/IndexedDB"
  );

  return;
  //

  const ffzCollection = await createFFZUserCollection(
    collections.ffz.state.value || raise("No ffz"),
    collections.ffzRoom.state.value || raise("No ffz room"),
  );

  createBTTVUserCollection(
    collections.bttv.state.value || raise("No bttv"),
    ffzCollection.owner.displayName,
  );

  create7TVUserCollection(
    collections.seventv.state.value || raise("No seventv"),
    collections.seventvSet.state.value || raise("No seventv set"),
  );

  //

  const db = await openUserEmoteCollectionsDB();

  const userFromStore = await db.get("profiles", nickname.value);

  if (userFromStore) {
    user.value; // FIXME - here put value from idb to user ref
    const emotes = getMappedEmotesFromIdb(userFromStore, db);
    console.log({ emotesFromDB: emotes });
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
      collections.seventv;
      collections.seventvSet;
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
    collections;
    // map fetched data and save it
  }

  return;
  await until(collections.fetch.isReady).toBe(true, {
    timeout: 30_000,
    throwOnTimeout: true,
  });
  // NOW CAN ADD MAPPED COLLECTION TO STORE

  return;

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
