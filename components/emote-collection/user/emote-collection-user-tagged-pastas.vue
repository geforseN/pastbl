<template>
  <div class="rounded-btn border-2 p-1">
    <i18n-t
      :keypath="
        !pastas?.length
          ? 'userCollection.taggedPastas.notFound'
          : 'userCollection.taggedPastas.found'
      "
      class="flex items-baseline gap-1 p-1 text-xl font-bold"
      tag="h2"
    >
      <chat-pasta-tag :tag="`@${login}`" class="w-fit" />
    </i18n-t>
    <div @mouseover="findEmoteForHoverHint">
      <chat-pasta-list
        v-if="pastas?.length && canShowPastas"
        class="pasta-list max-h-[46dvh]"
        :items="pastas"
        @remove-pasta="(pasta) => emit('removePasta', pasta)"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  login: TwitchUserLogin;
  pastas?: IDBMegaPasta[];
  canShowPastas: boolean;
}>();

const emit = defineEmits<{
  removePasta: [IDBMegaPasta];
}>();

const onHoverHint = inject<ExtendedOnHoverHint>("onHoverHint") || raise();

const findEmoteForHoverHint = useThrottleFn(
  onHoverHint.allEmotesHandler,
  100,
  true,
);
</script>
