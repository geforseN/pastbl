<template>
  <article class="form-control p-2">
    <label class="label cursor-pointer text-xl font-medium" for="badges-count">
      <h3>{{ $t(s + "badges-count") }}</h3>
    </label>
    <user-settings-badges-count
      :badges-count="badgesCount"
      @update:badges-count="(c) => (badgesCount = c)"
    />
  </article>
</template>
<script lang="ts" setup>
import { s } from "~/components/user-settings/user-settings.vue";

const badgesCount = defineModel<number>({ required: true });
</script>
