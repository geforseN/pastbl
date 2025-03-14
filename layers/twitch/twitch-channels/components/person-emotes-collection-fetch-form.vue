<template>
  <form
    class="rounded-box border-2 p-2"
    @submit.prevent="personEmotesCollectionLoad.execute"
  >
    <div class="flex justify-between p-2">
      <h2
        id="heading"
        class="text-3xl font-bold"
      >
        {{ $t("collections.users.fetch.heading") }}&nbsp;
      </h2>
      <emote-integration-logos />
    </div>
    <person-emotes-collection-fetch-input-group
      ref="inputGroup"
      v-model:nickname="twitchChannelsSearchNickname"
    >
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
    </person-emotes-collection-fetch-input-group>
    <twitch-channels-search
      ref="twitchChannelsSearch"
      :must-show="twitchChannels.mustShow"
      :channels="twitchChannels.state"
      @load="
        (nickname) => {
          twitchChannelsSearchNickname = nickname;
        }
      "
    />
    <person-emotes-collection-must-select-on-load
      v-model="mustSelectCollectionOnLoad.state"
    />
  </form>
</template>
<script setup lang="ts">
import type {
  TwitchChannelsSearch,
  PersonEmotesCollectionFetchInputGroup,
} from "#build/components";

defineExpose({
  focusInput() {
    inputRef.value!.focus();
  },
});

const twitchChannelsSearchNickname = ref("");

const twitchChannelsSearchRef = useTemplateRef("twitchChannelsSearch");
const twitchChannelsSearchContainer = computed(
  () => twitchChannelsSearchRef.value?.containerRef || raise(),
);

const inputGroupRef = useTemplateRef("inputGroup");
const inputRef = computed(() => inputGroupRef.value?.inputRef || raise());

const mustSelectCollectionOnLoad = reactive(
  useIndexedDBKeyValue(
    "fetch-person-emotes-collection:must-select-onload",
    true,
  ),
);

const twitchChannels = reactive(
  useTwitchChannelsSearch(useDebounce(twitchChannelsSearchNickname, 500)),
);

const personEmotesCollectionLoad = reactive(
  usePersonEmotesCollectionLoad(twitchChannelsSearchNickname, {
    mustClearNicknameInputBeforeLoad: true,
    mustSelectCollectionAfterLoad: mustSelectCollectionOnLoad.state,
  }),
);

onMounted(() => {
  whenever(useFocus(inputRef).focused, twitchChannels.show);
  onClickOutside(twitchChannelsSearchContainer, twitchChannels.hide, {
    ignore: [inputRef],
  });
});
</script>
<style scoped>
h2 {
  scroll-margin: 20px;
}
</style>
