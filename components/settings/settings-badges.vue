<template>
  <article class="form-control p-2">
    <label class="label cursor-pointer text-xl font-medium" for="badges-count">
      <h3>{{ $t("settings.badges-count._") }}</h3>
    </label>
    <settings-badges-count v-model="badgesCount" />
  </article>
</template>
<script lang="ts" setup>
const badgesCount = defineModel<number>({ required: true });
</script>
