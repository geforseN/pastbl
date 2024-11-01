<template>
  <pastbl-with-settings-tooltip>
    <pastbl-settings-button @click="isSettingsOpen.toggle" />
    <teleport
      v-if="isAppVisible"
      to="#pastbl-app"
    >
      <pastbl-settings-modal
        v-if="isSettingsOpen.state"
      />
    </teleport>
  </pastbl-with-settings-tooltip>
</template>
<script setup lang="ts">
import PastblWithSettingsTooltip from "~/components/pastbl-with-settings-tooltip.vue";
import PastblSettingsButton from "~/components/pastbl-settings-button.vue";
import PastblSettingsModal from "~/components/pastbl-settings-modal.vue";

defineProps<{
  isAppVisible: boolean;
}>();

const isSettingsOpen = reactive(useBool());
</script>
