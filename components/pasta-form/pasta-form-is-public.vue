<template>
  <div>
    <label for="pasta-is-public" class="grow cursor-pointer">
      {{ $t("pasta.makePublic?") }}
    </label>
    <span>{{ $t(isPublic ? "yes" : "no") }}</span>
    <input
      id="pasta-is-public"
      v-model="isPublic"
      type="checkbox"
      name="pasta-is-public"
      class="checkbox-info checkbox"
    />
  </div>
</template>
<script lang="ts" setup>
const isPublic = defineModel<boolean>({ required: true });
</script>
