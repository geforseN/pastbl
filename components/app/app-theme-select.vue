<template>
  <div class="relative">
    <label
      for="app-theme"
      class="absolute -top-1.5 left-3 block bg-base-100 px-1 py-0 text-base/tight opacity-80"
    >
      {{ $t("theme.label") }}
    </label>
    <select
      id="app-theme"
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
</script>
