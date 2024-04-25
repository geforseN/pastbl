<template>
  <div class="relative">
    <label
      :for="id"
      class="absolute -top-1.5 left-2.5 block rounded-md bg-base-100/95 px-1 py-0 text-sm/tight xs:-top-2 xs:left-3 xs:text-sm/tight"
    >
      {{ $t("theme.label") }}
    </label>
    <select
      :id
      v-model="themes.selected"
      class="select select-bordered select-sm xs:select-md"
      name="select-app-theme"
    >
      <option
        v-for="[theme, name] of themes.entries"
        :key="name"
        :value="theme"
      >
        {{ name }}
      </option>
    </select>
  </div>
</template>
<script setup lang="ts">
const themes = reactive(useThemes());

const id = useId();
</script>
