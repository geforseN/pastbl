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
import { openDB } from "idb";
import type { DBSchema, IDBPDatabase } from "idb";
import { fetchBetterTTVGlobalEmotes } from "~/integrations/BetterTTV/BetterTTV.api";
import { fetchFFZGlobalEmoteSets } from "~/integrations/FrankerFaceZ/FrankerFaceZ.api";
import type { FrankerFaceZEmoteFromApi } from "~/integrations/FrankerFaceZ/FrankerFaceZ.api";
import type { FrankerFaceZEmote } from "~/integrations/FrankerFaceZ/FrankerFaceZ.client";
import { sevenTVApi } from "~/integrations/SevenTV/SevenTV.api";

useHead({ title: "collections - pastbl" });

const nickname = useUrlQueryParam("nickname");
const shouldShowInput = nickname.value === "";
const collections = useAsyncEmotesState(nickname);

const userStore = useUserStore();

if (nickname.value) {
  collections.fetch.execute();
}
const DB = ref<IDBPDatabase<EmoteCollectionDB>>();
onMounted(async () => {
  const { SevenTVCollection, SevenTVEmote, SevenTVSet } = await import(
    "~/integrations/SevenTV/SevenTV.client"
  );
  const { FFZCollection, FFZEmote, FFZEmoteSet } = await import(
    "~/integrations/FrankerFaceZ/FrankerFaceZ.client"
  );
  const { BTTVCollection, BTTVEmote, BTTVSet } = await import(
    "~/integrations/BetterTTV/BetterTTV.client"
  );
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
  async function getCollectionFromFFZSets(
    ffzGlobalSet: Awaited<ReturnType<typeof fetchFFZGlobalEmoteSets>>,
    toFFZEmoteCallback: (value: FrankerFaceZEmoteFromApi) => FrankerFaceZEmote,
  ) {
    const ffzSets = Object.values(ffzGlobalSet.sets).map(
      (apiSet) => new FFZEmoteSet(apiSet, toFFZEmoteCallback),
    );
    return new FFZCollection(ffzSets);
  }

  async function addBTTVGlobalCollectionToIndexedDB(
    db: IDBPDatabase<EmoteCollectionDB>,
    bttvGlobalEmotes: Awaited<ReturnType<typeof fetchBetterTTVGlobalEmotes>>,
  ) {
    const bttvGlobalSets = [
      new BTTVSet(
        {
          emotes: bttvGlobalEmotes,
          name: "Global BetterTTV emotes",
          id: "bttv::global",
        },
        (emote) => new BTTVEmote(emote, "global"),
      ),
    ];
    const bttvGlobalCollection = new BTTVCollection(bttvGlobalSets);
    const bttvGlobal = await db.add("@@global", bttvGlobalCollection);
    console.log({ bttvGlobal, bttvGlobalCollection });
  }

  async function addSevenTVGlobalCollectionToIndexedDB(
    db: IDBPDatabase<EmoteCollectionDB>,
  ) {
    const sevenTVHalloweenEmotesSet =
      await sevenTVApi.globalHalloweenEmotesSet();
    const sevenTVEmotesSet = await sevenTVApi.globalEmotesSet();

    const sevenTVSets = [
      new SevenTVSet(
        sevenTVHalloweenEmotesSet,
        (emote) => new SevenTVEmote(emote),
      ),
      new SevenTVSet(sevenTVEmotesSet, (emote) => new SevenTVEmote(emote)),
    ];
    const sevenTVCollection = new SevenTVCollection(sevenTVSets);
    const sevenTVGlobal = await db.add("@@global", sevenTVCollection);
    console.log({ sevenTVGlobal, sevenTVGlobalCollection: sevenTVCollection });
  }
  try {
    // FIXME: here should handle rejected promises
    await Promise.allSettled([
      fetchBetterTTVGlobalEmotes().then((bttvGlobalEmotes) =>
        addBTTVGlobalCollectionToIndexedDB(db, bttvGlobalEmotes),
      ),
      fetchFFZGlobalEmoteSets()
        .then((ffzSets) => console.log({ ffzSets }) || ffzSets)
        .then((ffzSets) =>
          getCollectionFromFFZSets(
            ffzSets,
            (apiEmote) => new FFZEmote(apiEmote, "global"),
          ),
        )
        .then(
          (ffzCollection) =>
            console.log({ ffzCollection }) || db.add("@@global", ffzCollection),
        ),
      addSevenTVGlobalCollectionToIndexedDB(db),
    ]);
  } catch {}
});
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
export interface EmoteCollectionDB extends DBSchema {
  "@@global": any;
  saved: any;
}
</script>
