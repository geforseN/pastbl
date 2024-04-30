<template>
  <dynamic-scroller
    list-class="w-[340px] xs:w-auto"
    :min-item-size="100"
    list-tag="ul"
    item-tag="li"
    item-class="max-w-[340px] xs:max-w-none"
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
          <template #sidebar>
            <chat-pasta-sidebar
              dropdown-class="dropdown dropdown-top xs:dropdown-end dropdown-hover"
              :pasta-edit-page-path="`/pastas/edit/${pasta.id}`"
              @copy="userStore.copyPasta(pasta)"
              @delete="emit('removePasta', pasta)"
            />
          </template>
        </chat-pasta>
      </dynamic-scroller-item>
    </template>
  </dynamic-scroller>
</template>
<script lang="ts">
import type { IEmote } from "~/integrations";

export const l = "pasta.list." as const;
</script>
<script setup lang="ts">
const userStore = useUserStore();
const emotesStore = useEmotesStore();

const props = defineProps<{
  findEmote?(token: string): IEmote | undefined;
}>();

const findEmote = props.findEmote || emotesStore.findEmote;

const emit = defineEmits<{
  removePasta: [IDBMegaPasta];
}>();
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
