<template>
  <div class="relative">
    <label
      :for="id"
      class="absolute -top-1.5 left-2.5 block rounded-md bg-base-100/95 px-1 py-0 text-sm/tight xs:-top-2 xs:left-3 xs:text-sm/tight"
    >
      {{ $t("language") }}
    </label>
    <select
      :id
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
import { useLocales } from "../composables/useLocales";

const locales = reactive(useLocales());

const id = useId();
</script>
