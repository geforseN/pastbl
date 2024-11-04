<template>
  <nav class="flex w-full justify-between">
    <app-settings />
    <div class="tabs tabs-bordered h-full self-end  border border-white/30 bg-purple-900 py-0">
      <input
        v-for="tab of tabs"
        :key="tab.key"
        v-model="selectedTagKey"
        :disabled="tab.disabled"
        :title="tab.title"
        :value="tab.key"
        class="tab h-full px-8 text-2xl text-white"
        role="tab"
        type="radio"
        :aria-label="tab.label"
      />
    </div>
    <slot name="right" />
  </nav>
</template>
<script setup lang="ts">
import AppSettings from "~/components/settings/app-settings.vue";

const selectedTagKey = defineModel<string>("selectedTagKey", { required: true });

defineProps<{
  tabs: IAppTab[];
}>();

defineSlots<{
  right?: VueSlot;
}>();
</script>
