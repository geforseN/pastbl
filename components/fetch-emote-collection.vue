<template>
  <section class="rounded-box border-2 p-2">
    <div class="flex justify-between p-2">
      <h2 id="load-user-collection-heading" class="text-3xl font-bold">
        Load user collection&nbsp;
      </h2>
      <emote-integration-logo-square />
    </div>
    <div class="join">
      <input
        id="nickname"
        ref="inputRef"
        v-model="nickname"
        name="nickname"
        placeholder="Enter twitch nickname"
        class="input join-item input-accent grow"
        type="text"
        @keyup.enter="loadInputCollection()"
      />
      <button class="btn btn-accent join-item" @click="loadInputCollection()">
        Load collection
      </button>
    </div>
    <div
      ref="channelsContainerRef"
      v-auto-animate
      class="flex max-h-60 flex-col overflow-y-auto rounded"
      :class="mustShowChannels && 'border border-accent'"
    >
      <template v-if="mustShowChannels">
        <div
          v-for="channel of channels"
          :key="channel.id"
          class="flex items-center gap-2 bg-slate-600 p-1"
        >
          <img
            :src="channel.thumbnailUrl"
            width="24"
            height="24"
            loading="lazy"
            :alt="`${channel.nickname} avatar`"
          />
          {{ channel.nickname }}
          <div class="ml-auto flex items-center gap-1">
            <span
              v-if="channel.isExact"
              class="badge rounded-md border-0 bg-success font-bold uppercase"
            >
              Exact
            </span>
            <span
              v-if="channel.isLive"
              class="badge rounded-md border-0 bg-red-600 font-bold uppercase"
            >
              Live
            </span>
            <button
              class="btn btn-accent btn-xs"
              @click="handleSearchBarClick(channel.nickname)"
            >
              Load
            </button>
          </div>
        </div>
      </template>
    </div>
    <div v-auto-animate class="flex flex-col gap-2">
      <loading-user-emote-collection-btnlike
        v-for="collection of userCollectionsStore.loadingCollections"
        :key="collection.username"
        :collection="collection"
      />
    </div>
  </section>
</template>
<script lang="ts" setup>
import type { ExtraChannel } from "~/server/api/twitch/search/channels.get";

const params = useUrlSearchParams<{
  "focus-fetch-input"?: "true";
}>("history");
const inputRef = ref<HTMLInputElement>();
const channelsContainerRef = ref<HTMLDivElement>();
const mustShowChannels = ref(false);

onMounted(() => {
  if (params["focus-fetch-input"] === "true") {
    inputRef.value?.focus();
  }
});

const { focused: isInputFocused } = useFocus(inputRef);
onClickOutside(
  channelsContainerRef,
  () => {
    mustShowChannels.value = false;
  },
  { ignore: [inputRef] },
);
whenever(isInputFocused, () => {
  mustShowChannels.value = true;
});

const nickname = ref("");
const debouncedNickname = useDebounce(nickname, 500);

const userCollectionsStore = useUserCollectionsStore();

const { data: channels } = useFetch("/api/twitch/search/channels", {
  lazy: true,
  default: (): ExtraChannel[] => [],
  query: { nickname: debouncedNickname },
  onRequest: () => {
    mustShowChannels.value = false;
    channels.value = [];
    assert.ok(debouncedNickname.value);
  },
  onResponse: () => {
    mustShowChannels.value = true;
  },
});

const toast = useNuxtToast();

async function _loadCollection(
  nickname: string,
  options: {
    beforeLoad?: () => MaybePromise<void>;
  } = {},
) {
  try {
    const collectionPromise = userCollectionsStore.loadCollection(nickname);
    await options.beforeLoad?.();
    await collectionPromise;
  } catch (error) {
    assert.isError(error, ExtendedError);
    toast.add(error);
  }
}

const loadInputCollection = () =>
  _loadCollection(nickname.value, {
    beforeLoad() {
      nickname.value = "";
    },
  });

const loadSearchBarCollection = (nickname_: string) =>
  _loadCollection(nickname_, {
    beforeLoad() {
      nickname.value = "";
    },
  });

async function handleSearchBarClick(nickname: string) {
  await loadSearchBarCollection(nickname);
}
</script>
