<template>
  <div
    id="pastbl-app"
    :class="[
      appVisibility.state ? 'bg-purple-900 text-white' : 'pointer-events-none',
    ]"
    class="relative h-[400px] w-[320px]"
  >
    <app-main-button
      v-show="!appVisibility.state"
      class="pointer-events-auto absolute bottom-0 right-0 "
      @click="onMainButtonClick"
    />
    <div
      v-show="appVisibility.state"
      class="flex h-full flex-col items-center rounded-t-3xl"
    >
      <div class="h-[calc(100%-3rem)] w-full">
        <list-pastas-tab
          v-if="selectedTagKey === 'list'"
          :pastas
          :cursor
          :status="pastasLoad.status"
          :load-more="pastasLoad.execute"
          @response="handlePastasLoadResponse"
        />
        <create-pastas-tab v-if="selectedTagKey === 'create'" />
      </div>
      <app-bottom-nav
        v-model:selected-tag-key="selectedTagKey"
        :tabs
      >
        <template #right>
          <app-main-button @click="appVisibility.toggle" />
        </template>
      </app-bottom-nav>
    </div>
  </div>
</template>
<script setup lang="ts">
import { fetchPastas } from "~/utils/pastas";
import { pastas, cursor, handlePastasLoadResponse } from "~/utils/pastas.store";
import { useAppVisibility } from "~/utils/provide-inject-app-visibility";
import { useLazyPastasLoad } from "~/composables/usePastasLoad";
import { useAppTabs } from "~/composables/useAppTabs";
import AppBottomNav from "~/components/app/app-bottom-nav.vue";
import AppMainButton from "~/components/app/app-main-button.vue";
import CreatePastasTab from "~/components/app/tabs/create-pastas-tab.vue";
import ListPastasTab from "~/components/app/tabs/list-pastas-tab.vue";

const pastasLoad = reactive(useLazyPastasLoad(fetchPastas));

const { selectedTagKey, tabs } = useAppTabs();

const { appVisibility } = useAppVisibility().withProvide();

let wasMainButtonPressed = false;
async function onMainButtonClick() {
  appVisibility.toggle();
  if (!wasMainButtonPressed) {
    wasMainButtonPressed = true;
    const response = await pastasLoad.execute(undefined, true);
    handlePastasLoadResponse(response);
  }
}
</script>
