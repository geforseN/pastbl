<template>
  <chat-pasta-list-hints>
    <div
      class="rounded-btn rounded-b-none border-2 border-b-0 px-2 py-1.5 xs:w-[420px]"
    >
      <chat-pasta-list-sort-select v-model="pastasStore.selectedSortStrategy" />
      <chat-pasta-list-show-select
        v-model="pastasStore.selectedShowStrategy"
        :selected-login="selectedLogin"
      />
    </div>
    <dynamic-scroller
      v-if="pastasStore.canShowPastas"
      :items="pastasStore.pastasToShow"
      :min-item-size="100"
      class="pasta-list flex max-h-[50dvh] flex-col overflow-y-auto xs:w-[420px] go-brr:max-h-[66dvh]"
      @mouseover="throttledMouseover"
    >
      <template #default="{ item: pasta, index, active }">
        <dynamic-scroller-item
          :item="pasta"
          :active="active"
          :size-dependencies="[pasta.message]"
          :data-index="index"
        >
          <chat-pasta
            :key="`${pasta.id}:${pasta.text}`"
            :pasta="pasta"
            @populate="
              (pastaTextContainer) => {
                populatePasta(pastaTextContainer, pasta, emotesStore);
              }
            "
          >
            <template #creatorData>
              <chat-pasta-creator-data
                :badges-count="userStore.user.badges.count.state"
                :nickname="userStore.user.nickname.text.state"
                :nickname-color="userStore.user.debounced.nickname.color"
              />
            </template>
            <template #sidebar>
              <chat-pasta-sidebar
                dropdown-class="dropdown dropdown-top xs:dropdown-end dropdown-hover"
                :pasta-id="pasta.id"
                :is-clipboard-supported="userStore.clipboard.isSupported"
                @copy="userStore.copyPasta(pasta)"
                @delete="pastasStore.removePasta(pasta)"
              />
            </template>
          </chat-pasta>
        </dynamic-scroller-item>
      </template>
    </dynamic-scroller>
    <teleport to="body">
      <hovered-emote-hint
        id="hoveredEmoteContainer"
        ref="hoveredEmoteRef"
        :emote="hoveredEmote"
      />
    </teleport>
  </chat-pasta-list-hints>
</template>
<script lang="ts">
import type { HoveredEmoteHint } from "#build/components";
import type { InjectHoveredEmote } from "~/app.vue";

export const l = "pasta.list." as const;
</script>
<script setup lang="ts">
const pastasStore = usePastasStore();
const userStore = useUserStore();
const emotesStore = useEmotesStore();

const selectedLogin = computed(
  () => useUserCollectionsStore().selectedCollectionLogin.state,
);

const { hoveredEmote, updateHoveredEmote, removeHoveredEmote } = inject(
  "hoveredEmote",
) as InjectHoveredEmote;
const hoveredEmoteRef = ref<InstanceType<typeof HoveredEmoteHint>>();
const hoveredEmoteContainerRef = computed(
  () => hoveredEmoteRef.value?.hoveredEmoteContainerRef,
);

const throttledMouseover = useThrottleFn(onMouseover, 100, true);

function onMouseover(event: Event) {
  assert.ok(event instanceof MouseEvent);
  const { target, relatedTarget } = event;
  if (!(target instanceof Element)) {
    return withLogSync(null, "not an element");
  }
  if (target.classList.contains("emote-hint")) {
    return withLogSync(null, "hint is hovered");
  }
  if (target.classList.contains("emoji")) {
    // TODO
  }
  if (
    relatedTarget instanceof HTMLImageElement &&
    !(target instanceof HTMLImageElement)
  ) {
    removeHoveredEmote();
    return;
  }
  if (target instanceof HTMLImageElement) {
    const emote = emotesStore.findEmote(target.alt);
    if (!emote) {
      return;
    }
    updateHoveredEmote(emote);
    assert.ok(hoveredEmoteContainerRef.value);
    hoveredEmoteContainerRef.value.style.top = `${event.pageY}px`;
    hoveredEmoteContainerRef.value.style.left = `${event.pageX}px`;
  }
}
</script>
<style>
.pasta-list .chat-pasta .chat-pasta-sidebar {
  @apply xs:dropdown-left;

  .dropdown .dropdown-content {
    @apply flex w-max flex-row xs:-translate-y-1/2;

    * {
      @apply w-min;
    }
  }
}
</style>
