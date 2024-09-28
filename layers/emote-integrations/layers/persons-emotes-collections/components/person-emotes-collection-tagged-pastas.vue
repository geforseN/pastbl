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
      <chat-pasta-tag
        :tag="`@${login}`"
        class="w-fit"
      />
    </i18n-t>
    <div v-on-mouseover="showEmoteCard">
      <local-pastas-list
        v-if="pastas?.length && canShowPastas"
        data-compact
        class="pasta-list max-h-[46dvh]"
        :items="pastas"
        @remove-pasta="(pasta) => $emit('removePasta', pasta)"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  login: TwitchUserLogin;
  pastas?: OmegaPasta[];
  canShowPastas: boolean;
}>();

defineEmits<{
  removePasta: [OmegaPasta];
}>();

const emoteOnHover = injectEmoteOnHover();

const showEmoteCard = () =>
  useThrottleFn(emoteOnHover.allEmotesHandler, 100, true);
</script>
