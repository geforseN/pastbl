<template>
  <div>
    <label
      :for="id"
      class="grow cursor-pointer"
    >
      {{ label }}
    </label>
    <span v-if="text">{{ text }}</span>
    <input
      :id
      v-model="isPublic"
      type="checkbox"
      name="pasta-is-public"
      class="checkbox-info checkbox"
    />
  </div>
</template>
<script setup lang="ts">
import { useId } from "vue";

defineProps<{
  label: string;
  text?: string;
}>();

const isPublic = defineModel<boolean>();

const id = useId();
</script>
