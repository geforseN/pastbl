<template>
  <with-active-pasta-action-buttons
    v-show="appVisibility.state"
    class="flex h-full flex-col"
    #="{ showActions }"
  >
    <pasta-actions-hint class="px-2 text-center text-2xl" />
    <pastas-list
      :pastas
      :cursor
      :load-more="async () => ({ pastas: [], cursor: null })"
      @show-actions="showActions"
      @response="() => { /* TODO */ }"
    />
  </with-active-pasta-action-buttons>
</template>
<script setup lang="ts">
import PastaActionsHint from "~/components/pastas/pasta-actions-hint.vue";
import PastasList from "~/components/pastas/list/pastas-list.vue";
import WithActivePastaActionButtons from "~/components/pastas/list/with-active-pasta-actions.vue";

defineProps<{
  pastas: XPasta[];
  cursor: Nullish<number>;
}>();

const appVisibility = inject<{ state: boolean }>("appVisibility");
if (!appVisibility) {
  throw new Error("isAppVisible is not provided");
}
</script>
