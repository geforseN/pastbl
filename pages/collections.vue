<template>
  <div>
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
          :seven-tv="collections.sevenTv"
          :seven-tv-set="collections.sevenTvSet"
        />
      </ol>
    </div>
    <vue-dd v-if="user" v-model="user" font-size="14px" />
  </div>
</template>

<script lang="ts" setup>
import { VueDd } from "vue-dd";

useHead({ title: "collections - pastbl" });

const nickname = useUrlQueryParam("nickname");
const shouldShowInput = nickname.value === "";
const collections = useAsyncEmotesState(nickname);

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
  collections.fetch.execute();

  const sevenTvUser = use7TVUser(22877031);
  const fc7 = await sevenTvUser.fullCollection.execute();
  setTimeout(() => {
    console.log({ sevenTvUser, fc7 });
  }, 5_000);
  console.log({ sevenTvUser, fc7 });
  const stv = ref(sevenTvUser);

  const db = await openUserEmoteCollectionsDB();
  const userFromStore = await db.get("profiles", nickname.value);
  if (userFromStore) {
    user.value = userFromStore;
    type T = "BetterTTV" | "FrankerFaceZ" | "SevenTV";
    const emotesIDBStore = db.transaction("emotes").store;

    const collections = Object.entries(userFromStore.collections).map(
      ([name, collection]) => {
        return {
          ...collection,
          source: name,
          sets: collection.sets.map((set) => ({
            id: set.id,
            name: set.name,
            source: set.source,
            updatedAt: set.updatedAt,
            emotes: set.emoteIds.map((id) =>
              emotesIDBStore.get([id, name as T]),
            ),
          })),
        };
      },
    );
    console.log({
      collections,
      0: userFromStore.collections,
      1: Object.entries(userFromStore.collections),
      stv,
    });
    console.log(
      await Promise.all(
        Object.values(collections).map((collection) =>
          Promise.all(collection.sets.map((set) => Promise.all(set.emotes))),
        ),
      ),
    );

    // ****************************************************************************
    // collections.fetch.state.value = Object.entries(
    //   userFromStore.collections,
    // ).reduce((record, [name, collection]) => {
    //   const nameRecord = {
    //     FrankerFaceZ: "ffzCollection",
    //     BetterTTV: "bttvCollection",
    //     SevenTV: "sevenTvCollection",
    //   };
    //   record[nameRecord[name]] = collection;
    //   return record;
    // }, {});
    // TODO: also map emotes

    return;
  }
  collections.fetch.execute();
  /// FIXME: REMOVE
  return;
  await until(collections.fetch.isReady).toBe(true, {
    timeout: 30_000,
    throwOnTimeout: true,
  });
  const userCollections = collections.fetch.state.value;
  if (!userCollections) {
    throw 1;
  }

  const allUserEmotes = createUserEmotesForIDB(userCollections);
  const userProfile = createUserProfileForIDB(userCollections);
  console.log({ allUserEmotes, userProfile });
  const result = await Promise.all([
    putUserProfileToDB(userProfile, db),
    putUserEmotesToDB(allUserEmotes, db),
  ]);
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
