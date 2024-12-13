<template>
  <div class="join w-full">
    <input
      id="fetch-nickname"
      ref="input"
      v-model="nickname"
      data-testid="person-emotes-collection-fetch-input"
      name="fetch-nickname"
      :placeholder="$t('collections.users.fetch.placeholder')"
      class="input join-item input-accent grow"
      type="search"
      required
    />
    <slot />
  </div>
</template>
<script setup lang="ts">
import { useTemplateRef } from "vue";

const inputRef = useTemplateRef("input");

const nickname = defineModel<string>("nickname", { required: true });

defineExpose({
  inputRef,
});
</script>
