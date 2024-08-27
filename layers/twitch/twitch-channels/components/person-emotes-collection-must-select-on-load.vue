<template>
  <div class="flex items-center justify-between p-2">
    <label for="must-select-collection-on-load">
      {{ $t("collections.users.fetch.must-select-onload") }}
    </label>
    <input
      id="must-select-collection-on-load"
      v-model="mustSelectCollectionOnLoad"
      type="checkbox"
      class="toggle toggle-accent"
      name="must-select-collection-on-load"
    />
  </div>
</template>
<script setup lang="ts">
const mustSelectCollectionOnLoad = defineModel<boolean>({ required: true });
</script>
