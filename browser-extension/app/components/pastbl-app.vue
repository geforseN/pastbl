<template>
  <div
    id="pastbl-app"
    :class="[
      !appVisibility.state && 'pointer-events-none',
    ]"
    class="relative h-[400px] w-[320px] bg-purple-900 text-white"
  >
    <pastbl-main-button
      v-show="!appVisibility.state"
      class="pointer-events-auto absolute bottom-0 right-0 "
      @click="onMainButtonClick"
    />
    <pastbl-with-active-pasta-action-buttons
      v-show="appVisibility.state"
      class="flex h-full flex-col justify-between rounded-3xl bg-inherit"
      #="{ showActions }"
    >
      <div
        class="flex h-[calc(100%-3rem)] flex-col items-center rounded-t-3xl px-2"
      >
        <pastbl-pasta-actions-hint class="text-xl" />
        <pastbl-pastas-list
          :pastas
          :cursor
          :load-more="async () => ({ pastas: [], cursor: null })"
          @show-actions="showActions"
          @response="() => { /* TODO */ }"
        />
      </div>
      <nav class="flex h-12 w-full justify-between rounded-b-3xl bg-inherit">
        <pastbl-settings :is-app-visible="appVisibility.state" />
        <pastbl-main-button
          @click="onMainButtonClick"
        />
      </nav>
    </pastbl-with-active-pasta-action-buttons>
  </div>
</template>
<script setup lang="ts">
import { useBool } from "~/composables/useBool";
import { fetchPastas } from "~/utils/pastas";
import { pastas, cursor } from "~/utils/pastas.store";
import { useLazyPastasLoad } from "~/composables/usePastasLoad";
import PastblWithActivePastaActionButtons from "./pastbl-with-active-pasta-actions.vue";
import PastblPastaActionsHint from "./pastbl-pasta-actions-hint.vue";
import PastblSettings from "./pastbl-settings.vue";
import PastblMainButton from "./pastbl-main-button.vue";
import PastblPastasList from "./pastbl-pastas-list.vue";

const appVisibility = reactive(useBool());

const pastasLoad = reactive(useLazyPastasLoad(fetchPastas));

let wasMainButtonPressed = false;
async function onMainButtonClick() {
  appVisibility.toggle();
  if (!wasMainButtonPressed) {
    wasMainButtonPressed = true;
    const response = await pastasLoad.execute(undefined, true);
    pastas.value.unshift(...response.pastas.toReversed());
    cursor.value = response.cursor;
  }
}
</script>
