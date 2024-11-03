<template>
  <div
    id="pastbl-app"
    :class="[
      appVisibility.state ? 'bg-purple-900 text-white' : 'pointer-events-none',
    ]"
    class="relative h-[400px] w-[320px]"
  >
    <pastbl-main-button
      v-show="!appVisibility.state"
      class="pointer-events-auto absolute bottom-0 right-0 "
      @click="onMainButtonClick"
    />
    <div
      v-show="appVisibility.state"
      class="flex h-full flex-col items-center rounded-t-3xl"
    >
      <div class="h-[calc(100%-3rem)] w-full">
        <pastas-list-tab
          v-if="selectedTagKey === 'list'"
          :pastas
          :cursor
        />
        <pastas-create-tab v-if="selectedTagKey === 'create'" />
      </div>
      <pastbl-app-bottom-nav
        v-model:selected-tag-key="selectedTagKey"
        :tabs
      >
        <template #right>
          <pastbl-main-button @click="onMainButtonClick" />
        </template>
      </pastbl-app-bottom-nav>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useBool } from "~/composables/useBool";
import { fetchPastas } from "~/utils/pastas";
import { pastas, cursor } from "~/utils/pastas.store";
import { useLazyPastasLoad } from "~/composables/usePastasLoad";
import { useAppTabs } from "~/composables/useAppTabs";
import PastblAppBottomNav from "~/components/app/pastbl-app-bottom-nav.vue";
import PastasCreateTab from "~/components/app/tabs/pastbl-create-tab.vue";
import PastasListTab from "~/components/app/tabs/pastbl-list-tab.vue";
import PastblMainButton from "@/components/app/pastbl-main-button.vue";

const appVisibility = reactive(useBool());

const pastasLoad = reactive(useLazyPastasLoad(fetchPastas));

const { selectedTagKey, tabs } = useAppTabs();

provide("appVisibility", appVisibility);

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
