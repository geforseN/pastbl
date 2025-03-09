<template>
  <div class="bg-neutral pointer-events-auto absolute inset-4 bottom-14 rounded p-2 text-xl">
    <fieldset class="bg-base-200 flex justify-between gap-1 p-2">
      <legend class="bg-base-100 text-base-content rounded px-1 text-xl">
        Pastbl Button Colors
      </legend>
      <settings-color-form-control
        v-model="$mainButtonStyles.borderColor"
        :label="`Border`"
      />
      <settings-color-form-control
        v-model="$mainButtonStyles.color"
        :label="`Text`"
      />
      <settings-color-form-control
        v-model="$mainButtonStyles.backgroundColor"
        :label="`Background`"
      />
    </fieldset>
  </div>
</template>
<script setup lang="ts">
import { $mainButtonStyles } from "~/utils/settings.store";
import SettingsColorFormControl from "~/components/settings/settings-color-form-control.vue";
</script>
