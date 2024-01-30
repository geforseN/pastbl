<template>
  <section class="rounded-box border-2 p-2">
    <div class="flex justify-between p-2">
      <h2 id="heading" class="text-3xl font-bold">
        Load user collection&nbsp;
      </h2>
      <emote-integration-logos />
    </div>
    <div class="join">
      <input
        id="nickname"
        ref="inputRef"
        v-model="channelsSearchNickname"
        name="nickname"
        placeholder="Enter twitch nickname"
        class="input join-item input-accent grow"
        type="search"
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
      :class="channelsSearch.mustShow && 'border border-accent'"
    >
      <template v-if="channelsSearch.mustShow">
        <div
          v-for="channel of channelsSearch.state"
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
  </section>
</template>
<script lang="ts">
import { set } from "@vueuse/core";
import type { AvailableEmoteSource } from "~/integrations";
import type { ExtraChannel } from "~/server/api/twitch/search/channels.get";

function useChannelsSearch(nickname: Ref<string>) {
  const mustShow = ref(false);
  const hide = () => set(mustShow, false);
  const show = () => set(mustShow, true);

  const { data: state } = useFetch("/api/twitch/search/channels", {
    lazy: true,
    query: { nickname },
    default(): ExtraChannel[] {
      return [];
    },
    onRequest() {
      hide();
      state.value = [];
      assert.ok(nickname.value);
    },
    onResponse: show,
  });

  return {
    state,
    mustShow,
    show,
    hide,
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
const sourceMap = new Map<AvailableEmoteSource, string>([
  ["FrankerFaceZ", "🐶"],
  ["BetterTTV", "🅱️"],
  ["SevenTV", "7️⃣"],
]);
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
const channelsSearch = reactive(
  useChannelsSearch(useDebounce(channelsSearchNickname, 500)),
);

whenever(useFocus(inputRef).focused, channelsSearch.show);
onClickOutside(channelsContainerRef, channelsSearch.hide, {
  ignore: [inputRef],
});

const userCollectionsStore = useUserCollectionsStore();
const toast = useNuxtToast();
async function handleCollectionLoad(nickname: string) {
  await loadCollection(
    async () => {
      assert.ok(
        nickname?.length,
        new ExtendedError("Nickname is required", {
          color: "red",
          title: "Emotes load error",
        }),
      );
      const collection = await userCollectionsStore.loadCollection(
        toLowerCase(nickname),
      );

      const statuses = Object.values(collection.integrations)
        .map((integration) => {
          const emojiStatus = integration.status === "ready" ? "✅" : "❌";
          return sourceMap.get(integration.source) + emojiStatus;
        })
        .join(", ");
      toast.add({
        color: "green",
        title: "Emotes loaded",
        timeout: 7_000,
        description: `Loaded ${collection.user.twitch.nickname} emotes\n${statuses}`,
      });
    },
    {
      beforeLoad() {
        channelsSearchNickname.value = "";
      },
      onError(error) {
        assert.isError(error, ExtendedError);
        toast.add(error);
      },
    },
  );
}
</script>
