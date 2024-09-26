<template>
  <div>
    <label :for="id" class="grow cursor-pointer">
      {{ $t("pasta.makePublic?") }}
    </label>
    <span>{{ $t(isPublic ? "yes" : "no") }}</span>
    <input
      :id
      v-model="isPublic"
      type="checkbox"
      name="pasta-is-public"
      class="checkbox-info checkbox"
    />
  </div>
</template>
<script setup>
const isPublic = defineModel < boolean > { required: true };

const id = useId();
</script>
