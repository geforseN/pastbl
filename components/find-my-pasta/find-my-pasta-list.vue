<template>
  <div
    v-auto-animate
    class="flex max-h-[78.3dvh] flex-col gap-y-2 overflow-y-auto"
  >
    <chat-pasta v-for="pasta of props.pastas" :key="pasta.id" :pasta="pasta">
      <template #creatorData>
        <chat-pasta-creator-data
          :badges-count="userStore.user.badges.count"
          :nickname="userStore.user.nickname"
          :nickname-color="userStore.user.preferences.nickname.color"
        />
      </template>
      <template #sidebar>
        <button
          class="btn btn-square btn-md ml-auto rounded-none border-2 border-accent text-xs xs:ml-0"
          :disabled="!clipboard.isSupported.value"
          @click="copyPasta(pasta)"
        >
          copy pasta
        </button>
      </template>
    </chat-pasta>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  pastas: IDBMegaPasta[];
}>();

const userStore = useUserStore();

const clipboard = useClipboard();

const { copyPasta } = usePastaCopy({ userStore, clipboard });
</script>
