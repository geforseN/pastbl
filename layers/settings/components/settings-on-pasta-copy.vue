<template>
  <div class="form-control p-2">
    <label for="pasta-oncopy" class="label cursor-pointer text-xl font-medium">
      {{ $t("settings.on-pasta-copied._") }}
    </label>
    <select
      id="pasta-oncopy"
      v-model="oncopy"
      class="select select-secondary"
      name="pasta-oncopy"
    >
      <option
        v-for="[name, translatedText] in Object.entries(options)"
        :key="name"
        :value="name"
      >
        {{ translatedText }}
      </option>
    </select>
  </div>
</template>
<script lang="ts" setup>
import type { IndexedDBKeyValueStoreSchema } from "~/client-only/IndexedDB";

const oncopy = defineModel<string>({ required: true });

defineProps<{
  options: Record<IndexedDBKeyValueStoreSchema["pasta:oncopy"], string>;
}>();
</script>
