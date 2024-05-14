<template>
  <!-- LINK: https://tailwindcss.com/blog/tailwindcss-v3-2#container-queries -->
  <!-- LINK: https://tailwindcss.com/blog/tailwindcss-v3-2#container-queries -->
  <!-- LINK: https://github.com/Akryum/vue-virtual-scroller/blob/master/packages/vue-virtual-scroller/README.md#dynamicscroller -->
  <!-- NOTE: item-class must not be display:inline or else width of component will be incorrect -->
  <dynamic-scroller
    class="chat-pasta-list hidden"
    list-class="min-w-[340px] sm:min-w-[420px]"
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
          <template #sidebar>
            <chat-pasta-sidebar
              class="@[300px]:bg-red-200"
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

const props = defineProps<{
  findEmote?: (token: string) => IEmote | undefined;
}>();

const findEmote = props.findEmote || useEmotesStore().findEmote;

const emit = defineEmits<{
  removePasta: [IDBMegaPasta];
}>();
</script>
