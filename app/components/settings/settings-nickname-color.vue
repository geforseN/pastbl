<template>
  <article class="form-control p-2">
    <label
      class="label cursor-pointer text-xl font-medium"
      for="nickname-color"
    >
      <h3>{{ $t("settings.nickname.color") }}</h3>
    </label>
    <input
      id="nickname-color"
      v-model="nicknameColor"
      class="input input-bordered w-full px-1"
      type="color"
      name="nickname-color"
    />
  </article>
</template>
<script lang="ts" setup>
const nicknameColor = defineModel<string>({ required: true });
</script>
