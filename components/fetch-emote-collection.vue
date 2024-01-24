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
        v-model="channelsSearchNickname"
        name="nickname"
        placeholder="Enter twitch nickname"
        class="input join-item input-accent grow"
        type="text"
        @keyup.enter="handleCollectionLoad(channelsSearchNickname)"
      />
      <button
        class="btn btn-accent join-item"
        @click="handleCollectionLoad(channelsSearchNickname)"
      >
        Load collection
      </button>
    </div>
    <div
      ref="channelsContainerRef"
      v-auto-animate
      class="flex max-h-60 flex-col overflow-y-auto rounded"
      :class="channels.mustShow && 'border border-accent'"
    >
      <template v-if="channels.mustShow">
        <div
          v-for="channel of channels.state"
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
              @click="handleCollectionLoad(channel.nickname)"
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
<script lang="ts">
import type { ExtraChannel } from "~/server/api/twitch/search/channels.get";

function useChannelsSearch(nickname: Ref<string>) {
  const mustShow = ref(false);

  const { data: state } = useFetch("/api/twitch/search/channels", {
    lazy: true,
    query: { nickname },
    default(): ExtraChannel[] {
      return [];
    },
    onRequest() {
      mustShow.value = false;
      state.value = [];
      assert.ok(nickname.value);
    },
    onResponse() {
      mustShow.value = true;
    },
  });

  return {
    state,
    mustShow,
    hide() {
      mustShow.value = false;
    },
    show() {
      mustShow.value = true;
    },
  };
}

async function loadCollection(
  getCollectionAsyncFn: () => Promise<void>,
  options: {
    beforeLoad?: () => MaybePromise<void>;
    onError?: (error: unknown) => MaybePromise<void>;
  } = {},
) {
  try {
    const collectionPromise = getCollectionAsyncFn();
    await options.beforeLoad?.();
    await collectionPromise;
  } catch (error) {
    await options.onError?.(error);
  }
}
</script>
<script lang="ts" setup>
const inputRef = ref<HTMLInputElement>();
const channelsContainerRef = ref<HTMLDivElement>();

onMounted(() => {
  const params = useUrlSearchParams<{
    "focus-fetch-input"?: "true";
  }>("history");
  if (params["focus-fetch-input"]) {
    inputRef.value?.focus();
  }
});

const channelsSearchNickname = ref("");
const channels = reactive(
  useChannelsSearch(useDebounce(channelsSearchNickname, 500)),
);

whenever(useFocus(inputRef).focused, channels.show);
onClickOutside(channelsContainerRef, channels.hide, {
  ignore: [inputRef],
});

const userCollectionsStore = useUserCollectionsStore();

async function handleCollectionLoad(nickname: string) {
  await loadCollection(() => userCollectionsStore.loadCollection(nickname), {
    beforeLoad() {
      channelsSearchNickname.value = "";
    },
    onError(error) {
      assert.isError(error, ExtendedError);
      useNuxtToast().add(error);
    },
  });
}
</script>
