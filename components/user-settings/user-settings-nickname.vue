<template>
  <article class="form-control p-2">
    <label class="label cursor-pointer text-xl font-medium" for="nickname">
      <h3>Nickname</h3>
    </label>
    <input
      id="nickname"
      v-model="nickname"
      class="input input-bordered input-secondary text-lg hover:bg-base-300 focus:bg-base-300"
      spellcheck="false"
      name="nickname"
      placeholder="e.g. Kappa"
    />
  </article>
</template>
<script lang="ts" setup>
const nickname = defineModel({ required: true, type: String });
</script>
