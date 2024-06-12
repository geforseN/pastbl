<template>
  <article class="form-control p-2">
    <label class="label cursor-pointer items-end" for="badges-count">
      <h3 class="text-xl/tight font-medium">
        {{ $t("settings.badges-count._") }}
      </h3>
      <span
        class="label-text-alt text-sm"
        :class="
          model === badgesCount.max && 'border-b border-dashed border-b-warning'
        "
      >
        {{ model }}
        {{ "/" }}
        {{ badgesCount.max }}
      </span>
    </label>
    <settings-badges-count v-model="model" />
  </article>
</template>
<script lang="ts" setup>
import { badgesCount } from "~/config/const";

const model = defineModel<number>({ required: true });
</script>
