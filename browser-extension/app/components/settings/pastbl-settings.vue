<template>
  <pastbl-with-settings-tooltip>
    <pastbl-settings-button @click="isSettingsOpen.toggle" />
    <teleport
      v-if="appVisibility.state"
      to="#pastbl-app"
    >
      <pastbl-settings-modal
        v-if="isSettingsOpen.state"
      />
    </teleport>
  </pastbl-with-settings-tooltip>
</template>
<script setup lang="ts">
import PastblWithSettingsTooltip from "~/components/settings/pastbl-with-settings-tooltip.vue";
import PastblSettingsButton from "~/components/settings/pastbl-settings-button.vue";
import PastblSettingsModal from "~/components/settings/pastbl-settings-modal.vue";

const appVisibility = inject<{ state: boolean }>("appVisibility");
if (!appVisibility) {
  throw new Error("isAppVisible is not provided");
}

const isSettingsOpen = reactive(useBool());
</script>
