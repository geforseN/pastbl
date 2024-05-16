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
    <emote-collection-user-fetch-channels-search
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
<!-- TODO: move to file no setup script -->
<script lang="ts">
const f = "collections.users.fetch.";

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
</script>
<script setup lang="ts">
defineExpose({
  focusInput() {
    inputRef.value!.focus();
  },
});

const channelsContainerRef = ref<HTMLDivElement>();

const channelsSearchNickname = ref("");
const channelsSearch = reactive(
  useChannelsSearch(useDebounce(channelsSearchNickname, 500)),
);

const inputRef = ref<HTMLInputElement>();

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

const toast = useMyToast();

async function handleCollectionLoad() {
  const nickname = channelsSearchNickname.value;
  isLoadingCollection.value = true;
  await loadCollection(
    async () => {
      assert.ok(nickname?.length, toast.fail("fetchCollection__emptyInput"));
      const login = toLowerCase(nickname);
      const collection = await userCollectionsStore.loadCollection(login);
      const status = getEmoteIntegrationsStatus(collection);
      toast.notify("success", "collectionFetched", nickname, status);
      if (mustSelectCollectionOnLoad.state.value) {
        userCollectionsStore.selectCollection(login);
      }
    },
    {
      beforeLoad() {
        channelsSearchNickname.value = "";
      },
      onError: toast.throw,
      onEnd() {
        isLoadingCollection.value = false;
      },
    },
  );
}
</script>
<style scoped>
h2 {
  scroll-margin: 20px;
}
</style>
