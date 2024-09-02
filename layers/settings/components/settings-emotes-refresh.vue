<template>
  <article class="form-control p-2">
    <label
      class="label cursor-pointer text-xl font-medium"
      for="emotes-refresh"
    >
      <h3 class="text-xl/tight font-medium">
        {{ $t("settings.refresh-emotes.title") }}
      </h3>
    </label>
    <select
      id="emotes-refresh"
      v-model="selectedTime"
      class="select select-secondary"
      name="emotes-refresh"
    >
      <option v-for="[key, time] of objectEntries(options)" :key :value="key">
        {{ time }}
      </option>
    </select>
    <i18n-t
      keypath="settings.refresh-emotes.description"
      tag="span"
      class="label-text-alt mt-1 px-1"
    >
      {{ getI18nTime($t, selectedTime) }}
    </i18n-t>
  </article>
</template>
<script setup lang="ts">
const selectedTime = defineModel<MyTimeString>({ required: true });

defineProps<{
  options: Record<MyTimeString, string>;
}>();

function getI18nTime(t: VueI18n["t"], time: MyTimeString) {
  const format = time.at(-1);
  const int = Number.parseInt(time, 10);
  assert.ok(Number.isInteger(int));
  return t(`myTimeString.${format}.${int}`);
}
</script>
