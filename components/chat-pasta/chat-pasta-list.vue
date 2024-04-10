<template>
  <dynamic-scroller :min-item-size="100">
    <template #default="{ item: pasta, index, active }">
      <dynamic-scroller-item
        :item="pasta"
        :active="active"
        :size-dependencies="[pasta.text]"
        :data-index="index"
      >
        <chat-pasta
          :key="`${pasta.id}:${pasta.text}`"
          :pasta="pasta"
          @populate="
            (pastaTextContainer) => {
              populatePasta(
                pastaTextContainer,
                pasta.validTokens,
                emotesStore.findEmote,
              );
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
export const l = "pasta.list." as const;
</script>
<script setup lang="ts">
const userStore = useUserStore();
const emotesStore = useEmotesStore();

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
