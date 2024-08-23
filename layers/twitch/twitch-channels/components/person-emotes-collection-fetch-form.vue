<template>
  <form
    class="rounded-box border-2 p-2"
    @submit.prevent="personEmotesCollectionLoad.execute"
  >
    <div class="flex justify-between p-2">
      <h2 id="heading" class="text-3xl font-bold">
        {{ $t("collections.users.fetch.heading") }}&nbsp;
      </h2>
      <emote-integration-logos />
    </div>
    <div class="join w-full">
      <input
        id="fetch-nickname"
        ref="inputRef"
        v-model="channelsSearchNickname"
        name="fetch-nickname"
        :placeholder="$t('collections.users.fetch.placeholder')"
        class="input join-item input-accent grow"
        type="search"
        required
      />
      <button class="btn btn-accent join-item w-2/6">
        <span
          v-if="personEmotesCollectionLoad.isLoading"
          class="flex items-center gap-2"
        >
          {{ $t("collections.users.fetch.button.text-on-load") }}
          <span class="loading loading-spinner" />
        </span>
        <template v-else>
          {{ $t("collections.users.fetch.button.text") }}
        </template>
      </button>
    </div>
    <twitch-channels-search
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
        {{ $t("collections.users.fetch.must-select-onload") }}
      </label>
      <input
        id="must-select-collection-on-load"
        v-model="mustSelectCollectionOnLoad.state"
        type="checkbox"
        class="toggle toggle-accent"
        name="must-select-collection-on-load"
      />
    </div>
  </form>
</template>
<script setup lang="ts">
defineExpose({
  focusInput() {
    inputRef.value!.focus();
  },
});

const channelsContainerRef = ref<HTMLDivElement>();

const channelsSearchNickname = ref("");
const channelsSearch = reactive(
  useTwitchChannelsSearch(useDebounce(channelsSearchNickname, 500)),
);

const inputRef = ref<HTMLInputElement>();

whenever(useFocus(inputRef).focused, channelsSearch.show);
onClickOutside(channelsContainerRef, channelsSearch.hide, {
  ignore: [inputRef],
});

const mustSelectCollectionOnLoad = reactive(
  useIndexedDBKeyValue(
    "fetch-person-emotes-collection:must-select-onload",
    true,
  ),
);

const personEmotesCollectionLoad = reactive(
  usePersonEmotesCollectionLoad(channelsSearchNickname, {
    mustClearNicknameInputBeforeLoad: true,
    mustSelectCollectionAfterLoad: mustSelectCollectionOnLoad.state,
  }),
);
</script>
<style scoped>
h2 {
  scroll-margin: 20px;
}
</style>
