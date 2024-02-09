<template>
  <article class="form-control p-2">
    <label class="label cursor-pointer text-xl font-medium" for="nickname">
      <h3>{{ $t(s + "nickname") }}</h3>
    </label>
    <input
      id="nickname"
      v-model="nickname"
      class="input input-bordered input-secondary text-lg hover:bg-base-300 focus:bg-base-300"
      spellcheck="false"
      name="nickname"
      :placeholder="$t(s + 'nickname-placeholder')"
    />
  </article>
</template>
<script lang="ts" setup>
import { s } from "~/components/user-settings/user-settings.vue";

const nickname = defineModel({ required: true, type: String });
</script>
