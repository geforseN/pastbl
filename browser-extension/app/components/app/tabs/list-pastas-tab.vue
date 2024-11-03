<template>
  <pastbl-with-active-pasta-action-buttons
    v-show="appVisibility.state"
    class="flex h-full flex-col"
    #="{ showActions }"
  >
    <pastbl-pasta-actions-hint class="px-2 text-center text-2xl" />
    <pastbl-pastas-list
      :pastas
      :cursor
      :load-more="async () => ({ pastas: [], cursor: null })"
      @show-actions="showActions"
      @response="() => { /* TODO */ }"
    />
  </pastbl-with-active-pasta-action-buttons>
</template>
<script setup lang="ts">
import PastblPastaActionsHint from "~/components/pastas/pastbl-pasta-actions-hint.vue";
import PastblPastasList from "~/components/pastas/pastbl-pastas-list.vue";
// eslint-disable-next-line @stylistic/max-len
import PastblWithActivePastaActionButtons from "~/components/pastas/pastbl-with-active-pasta-actions.vue";

defineProps<{
  pastas: XPasta[];
  cursor: Nullish<number>;
}>();

const appVisibility = inject<{ state: boolean }>("appVisibility");
if (!appVisibility) {
  throw new Error("isAppVisible is not provided");
}
</script>
