<template>
  <div class="join w-full">
    <input
      data-testid="person-emotes-collection-fetch-input"
      id="fetch-nickname"
      ref="inputRef"
      v-model="nickname"
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
const inputRef = ref<HTMLInputElement>();

const nickname = defineModel<string>("nickname", { required: true });

defineExpose({
  inputRef,
});
</script>
