<template>
  <article class="form-control p-2">
    <label class="label cursor-pointer text-xl font-medium" for="nickname">
      <h3>{{ $t("settings.nickname._") }}</h3>
    </label>
    <input
      id="nickname"
      v-model="nickname"
      class="input input-bordered input-secondary text-lg hover:bg-base-300 focus:bg-base-300"
      spellcheck="false"
      name="nickname"
      :placeholder="$t('settings.nickname.placeholder')"
    />
  </article>
</template>
<script lang="ts" setup>
const nickname = defineModel<string>({ required: true });
</script>
