<template>
  <!-- LINK: https://github.com/Akryum/vue-virtual-scroller/blob/master/packages/vue-virtual-scroller/README.md#dynamicscroller -->
  <!-- NOTE: item must not be display:inline or else width of component will be incorrect -->
  <dynamic-scroller
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
        class=""
      >
        <chat-pasta
          :key="`${pasta.id}:${pasta.text}`"
          v-bind="pasta"
          @copy="userStore.copyPasta(pasta)"
          @edit="navigateTo(useLocalePath()(`/pastas/edit/${pasta.id}`))"
          @remove="$emit('removePasta', pasta)"
          @populate="
            (pastaTextContainer) => {
              populatePasta(pastaTextContainer, pasta.validTokens, findEmote);
            }
          "
          @show-tag-context-menu="
            (event, tag) => {
              console.log(event, tag);
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
import type { CanFindEmote } from "~/utils/pasta-dom";

const userStore = useUserStore();

const props = defineProps<Partial<CanFindEmote>>();

const findEmote = props.findEmote || useEmotesStore().findEmote;

const emit = defineEmits<{
  removePasta: [IDBMegaPasta];
}>();
</script>
<style>
.chat-pasta-list > .vue-recycle-scroller__item-wrapper {
  @apply min-w-[342px];
}

.chat-pasta-list:not([data-compact]) {
  > .vue-recycle-scroller__item-wrapper {
    @apply sm:min-w-[420px];
  }

  .chat-pasta {
    & {
      @apply sm:flex-row;
    }

    .chat-pasta__main {
      @apply sm:p-2;
    }

    .actions123 {
      @apply sm:flex sm:px-0;
    }

    .chat-pasta__main-123 {
      @apply sm:border;
    }

    .block123 {
      @apply sm:block;
    }

    .remove123 {
      @apply sm:hidden;
    }

    .chat-pasta__created {
      @apply sm:flex sm:text-base;
    }

    .chat-pasta__sidebar {
      @apply sm:h-8;
    }

    .chat-pasta__sidebar-copy-button {
      @apply sm:h-14 sm:w-14 sm:text-sm/none;
    }

    .chat-pasta__sidebar-more-actions-button {
      @apply sm:h-8 sm:!min-h-8 sm:w-12;

      .more-horiz-icon {
        @apply sm:block;
      }

      .more-vert-icon {
        @apply sm:hidden;
      }
    }

    .chat-pasta__sidebar-more-actions-list {
      @apply sm:translate-x-12;
    }
  }
}
</style>
