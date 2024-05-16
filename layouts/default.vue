<template>
  <div
    class="mt-2 flex flex-col items-center justify-center gap-x-12 gap-y-4 go-brr:flex-row go-brr:items-start"
  >
    <slot />
    <slot name="leftColumn">
      <chat-pasta-list-hints>
        <client-only>
          <chat-pasta-list
            v-if="pastasStore.canShowPastas"
            :items="pastasStore.pastasToShow"
            @mouseover="throttledMouseover"
            @remove-pasta="(pasta) => pastasStore.removePasta(pasta)"
          />
        </client-only>
      </chat-pasta-list-hints>
    </slot>
  </div>
</template>
<script setup lang="ts">
const pastasStore = usePastasStore();

const onHoverHint = inject<ExtendedOnHoverHint>("onHoverHint") || raise();

const throttledMouseover = useThrottleFn(
  onHoverHint.allEmotesHandler,
  100,
  true,
);
</script>
<style>
.chat-pasta-list {
  max-height: 50dvh;
}

@media (min-width: 890px) {
  .chat-pasta-list {
    max-height: 66dvh;
  }
}
</style>
