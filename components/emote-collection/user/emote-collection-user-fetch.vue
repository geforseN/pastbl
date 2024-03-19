<template>
  <form class="rounded-box border-2 p-2" @submit.prevent="handleCollectionLoad">
    <div class="flex justify-between p-2">
      <h2 id="heading" class="text-3xl font-bold">
        {{ $t(f + "heading") }}&nbsp;
      </h2>
      <emote-integration-logos />
    </div>
    <div class="join w-full">
      <input
        id="fetch-nickname"
        ref="inputRef"
        v-model="channelsSearchNickname"
        name="fetch-nickname"
        :placeholder="$t(f + 'placeholder')"
        class="input join-item input-accent grow"
        type="search"
        required
      />
      <button class="btn btn-accent join-item w-2/6">
        <span v-if="isLoadingCollection" class="flex items-center gap-2">
          {{ $t(f + "button.text-on-load") }}
          <span class="loading loading-spinner" />
        </span>
        <template v-else>
          {{ $t(f + "button.text") }}
        </template>
      </button>
    </div>
    <user-collection-fetch-channels-search
      :must-show="channelsSearch.mustShow"
      :channels="channelsSearch.state"
      @load="
        (nickname) => {
          channelsSearchNickname = nickname;
        }
      "
    />
    <div class="flex items-center justify-between p-2">
      <label for="must-select-collection-on-load">
        {{ $t(f + "must-select-onload") }}
      </label>
      <input
        id="must-select-collection-on-load"
        v-model="mustSelectCollectionOnLoad.state.value"
        type="checkbox"
        class="toggle toggle-accent"
        name="must-select-collection-on-load"
      />
    </div>
  </form>
</template>
<script lang="ts">
import { set } from "@vueuse/core";
import type { EmoteSource } from "~/integrations";
import type { ExtraChannel } from "~/server/api/twitch/search/channels.get";

const f = "collections.users.fetch.";

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
    onEnd?: () => MaybePromise<void>;
    onError?: (error: unknown) => MaybePromise<void>;
  } = {},
) {
  try {
    const collectionPromise = getCollectionAsyncFn();
    await options.beforeLoad?.();
    await collectionPromise;
  } catch (error) {
    await options.onError?.(error);
  } finally {
    await options.onEnd?.();
  }
}
const sourceMap = new Map<EmoteSource, string>([
  ["FrankerFaceZ", "🐶"],
  ["BetterTTV", "🅱️"],
  ["SevenTV", "7️⃣"],
  ["Twitch", "🟣"],
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

const mustSelectCollectionOnLoad = useIndexedDBKeyValue(
  "user-collection-fetch:must-select-onload",
  true,
);
const isLoadingCollection = ref(false);
const userCollectionsStore = useUserCollectionsStore();
const toast = useNuxtToast();
const { t } = useI18n();
async function handleCollectionLoad() {
  const nickname = channelsSearchNickname.value;
  isLoadingCollection.value = true;
  await loadCollection(
    async () => {
      const m = "toast.loadCollection.";
      assert.ok(
        nickname?.length,
        new ExtendedError(t(m + "fail.emptyInputMessage"), {
          title: t(m + "fail.title"),
        }),
      );
      const login = toLowerCase(nickname);
      const collection = await userCollectionsStore.refreshCollection(login);
      const statuses = Object.values(collection.integrations)
        .map((integration) => {
          const emojiStatus = integration.status === "ready" ? "✅" : "❌";
          return sourceMap.get(integration.source) + emojiStatus;
        })
        .join(", ");
      toast.add({
        color: "green",
        title: t(m + "success.title"),
        timeout: 7_000,
        description: t(m + "success.message", { nickname, statuses }),
      });
      if (mustSelectCollectionOnLoad.state.value) {
        userCollectionsStore.selectCollection(login);
      }
    },
    {
      beforeLoad() {
        channelsSearchNickname.value = "";
      },
      onError(error) {
        assert.isError(error, ExtendedError);
        toast.add(error);
      },
      onEnd() {
        isLoadingCollection.value = false;
      },
    },
  );
}
</script>
