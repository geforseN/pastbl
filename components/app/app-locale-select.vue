<template>
  <div class="relative">
    <label
      for="select-locale"
      class="absolute -top-1.5 left-3 block bg-base-100 px-1 text-base/tight opacity-80"
    >
      {{ $t("language") }}
    </label>
    <select
      id="select-locale"
      class="select select-bordered select-sm xs:select-md"
      name="select-locale"
      @change="locales.change"
    >
      <option
        v-for="locale in locales.objects"
        :key="locale.code"
        :value="locale.code"
        :selected="locale.code === locales.selected"
      >
        {{ locale.name }}
      </option>
    </select>
  </div>
</template>
<script setup lang="ts">
const locales = reactive(useLocales());
</script>
