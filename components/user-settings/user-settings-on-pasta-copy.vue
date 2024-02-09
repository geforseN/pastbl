<template>
  <div class="form-control p-2">
    <label for="pasta-oncopy" class="label cursor-pointer text-xl font-medium">
      {{ $t(s + "when.pasta-copied.label") }}
    </label>
    <select
      id="pasta-oncopy"
      v-model="oncopy"
      class="select select-secondary"
      name="pasta-oncopy"
    >
      <option
        v-for="[name, translatedText] in Object.entries(props.options)"
        :key="name"
        :value="name"
      >
        {{ translatedText }}
      </option>
    </select>
  </div>
</template>
<script lang="ts">
import type { MyKeyValueSchema } from "~/client-only/IndexedDB";
import { s } from "~/components/user-settings/user-settings.vue";
</script>
<script lang="ts" setup>
const oncopy = defineModel<string>({ required: true });
const props = defineProps<{
  options: Record<MyKeyValueSchema["pasta:oncopy"], string>;
}>();
</script>
