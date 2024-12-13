<template>
  <!-- LINK: https://github.com/Akryum/vue-virtual-scroller/blob/master/packages/vue-virtual-scroller/README.md#dynamicscroller -->
  <!-- NOTE: item must not be display:inline or else width of component will be incorrect -->
  <dynamic-scroller
    data-testid="local-pastas-list"
    class="chat-pasta-list"
    :min-item-size="100"
    item-tag="li"
    list-tag="ol"
    :buffer="500"
    :data-compact="compact"
  >
    <template #default="{ item: pasta, index, active }">
      <dynamic-scroller-item
        :item="pasta"
        :active="active"
        :size-dependencies="[pasta.text]"
        :data-index="index"
      >
        <chat-pasta
          :key="`${pasta.id}:${pasta.text}`"
          v-bind="pasta"
          :text="pasta.text"
          :tags="pasta.tags"
          :time="{
            label: 'Created',
            value: pasta.createdAt,
          }"
          :compact
          @copy="pastasStore.copyPasta(pasta)"
          @edit="navigateTo($localePath(`/pastas/edit/${pasta.id}`))"
          @remove="$emit('removePasta', pasta)"
          @populate="
            (pastaTextContainer) => {
              populatePasta(pastaTextContainer, pasta.validTokens, findEmote);
            }
          "
        >
          <template #creatorData>
            <chat-pasta-creator-data
              :badges-count="userStore.user.badges.count.state"
              :nickname="userStore.user.nickname_"
              :nickname-color="userStore.user.debounced.nickname.color"
            />
          </template>
        </chat-pasta>
      </dynamic-scroller-item>
    </template>
  </dynamic-scroller>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { useEmotesStore } from "../../../../../app/stores/useEmotesStore";
import type { OmegaPasta } from "../utils/pasta";
import { usePastasStore } from "../../../../../app/stores/usePastasStore";
import { useUserStore } from "../../../../../app/stores/useUserStore";
import type { CanFindEmote } from "../utils/pasta-dom.ts";
import { useNuxtApp } from "#app/nuxt";

const userStore = useUserStore();
const pastasStore = usePastasStore();

const props = defineProps<Partial<CanFindEmote> & {
  compact: boolean;
}>();

const findEmote = computed(() => props.findEmote || useEmotesStore().findEmote);
const compact = computed(() => props.compact || useNuxtApp().$screen.isSmall);

defineEmits<{
  removePasta: [OmegaPasta];
}>();
</script>
