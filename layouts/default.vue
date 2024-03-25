<template>
  <div
    class="mt-2 flex flex-col items-center justify-center gap-x-12 gap-y-4 go-brr:flex-row go-brr:items-start"
  >
    <slot name="leftColumn">
      <chat-pasta-list-hints>
        <chat-pasta-list
          v-if="pastasStore.canShowPastas"
          class="pasta-list flex max-h-[50dvh] w-[420px] flex-col overflow-y-auto go-brr:max-h-[66dvh]"
          :items="pastasStore.pastasToShow"
          @mouseover="throttledMouseover"
          @remove-pasta="(pasta) => pastasStore.removePasta(pasta)"
        />
      </chat-pasta-list-hints>
    </slot>
    <slot />
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
