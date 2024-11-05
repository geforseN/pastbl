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
          @copy="pastasStore.copyPasta(pasta)"
          @edit="navigateTo(useLocalePath()(`/pastas/edit/${pasta.id}`))"
          @remove="$emit('removePasta', pasta)"
          @populate="
            (pastaTextContainer) => {
              populatePasta(pastaTextContainer, pasta.validTokens, findEmote);
            }
          "
          @show-tag-context-menu="
            (event, tag) => {
              log('debug', 'show-tag-context-menu', { event, tag });
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
import type { CanFindEmote } from "../utils/pasta-dom.ts";

const userStore = useUserStore();
const pastasStore = usePastasStore();

const props = defineProps<Partial<CanFindEmote>>();

const findEmote = props.findEmote || useEmotesStore().findEmote;

defineEmits<{
  removePasta: [OmegaPasta];
}>();
</script>
