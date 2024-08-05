<template>
  <article class="form-control p-2">
    <label class="label cursor-pointer items-end" for="badges-count">
      <h3 class="text-xl/tight font-medium">
        {{ $t("settings.badges-count._") }}
      </h3>
      <span
        class="label-text-alt text-sm"
        :class="
          badgesCount === appConfig.badges.count.max &&
          'border-b border-dashed border-b-warning'
        "
      >
        {{ badgesCount }}
        {{ "/" }}
        {{ appConfig.badges.count.max }}
      </span>
    </label>
    <settings-badges-count v-model="badgesCount" />
  </article>
</template>
<script lang="ts" setup>
const appConfig = useAppConfig();

const badgesCount = defineModel<number>({ required: true });
</script>
