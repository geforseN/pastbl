<template>
  <div class="pointer-events-auto absolute inset-x-8 inset-y-14 -translate-x-3 -translate-y-1 rounded bg-neutral p-2 text-xl">
    <fieldset class="flex justify-between gap-1 bg-base-200 p-2">
      <legend class="rounded bg-base-100 px-1 text-xl text-base-content">
        Pastbl Button Colors
      </legend>
      <settings-color-form-control
        v-model="mainButtonStyles.borderColor"
        :label="`Border`"
      />
      <settings-color-form-control
        v-model="mainButtonStyles.color"
        :label="`Text`"
      />
      <settings-color-form-control
        v-model="mainButtonStyles.backgroundColor"
        :label="`Background`"
      />
    </fieldset>
  </div>
</template>
<script setup lang="ts">
import { mainButtonStyles } from "~/utils/settings.store";
import SettingsColorFormControl from "~/components/settings/settings-color-form-control.vue";
</script>
