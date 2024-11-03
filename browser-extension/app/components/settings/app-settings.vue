<template>
  <with-settings-tooltip>
    <settings-button @click="isSettingsOpen.toggle" />
    <teleport
      v-if="appVisibility.state"
      to="#pastbl-app"
    >
      <settings-modal
        v-if="isSettingsOpen.state"
      />
    </teleport>
  </with-settings-tooltip>
</template>
<script setup lang="ts">
import WithSettingsTooltip from "~/components/settings/with-settings-tooltip.vue";
import SettingsButton from "~/components/settings/settings-button.vue";
import SettingsModal from "~/components/settings/settings-modal.vue";
import { injectAppVisibility } from "~/utils/provide-inject-app-visibility";

const appVisibility = injectAppVisibility();

const isSettingsOpen = reactive(useBool());
</script>
