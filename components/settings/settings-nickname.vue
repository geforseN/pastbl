<template>
  <article class="form-control relative p-2">
    <label class="label cursor-pointer items-end" for="nickname">
      <h3 class="text-xl/tight font-medium">
        {{ $t("settings.nickname._") }}
      </h3>
      <span
        class="label-text-alt text-sm"
        :class="
          nickname.length === nicknameLength.max &&
          'border-b border-dashed border-b-warning'
        "
      >
        {{ nickname.length }}
        {{ "/" }}
        {{ nicknameLength.max }}
      </span>
    </label>
    <input
      id="nickname"
      v-model="nickname"
      class="input input-bordered input-secondary text-lg hover:bg-base-300 focus:bg-base-300"
      spellcheck="false"
      name="nickname"
      :maxlength="nicknameLength.max"
      :placeholder="$t('settings.nickname.placeholder')"
    />
  </article>
</template>
<script lang="ts" setup>
import { nicknameLength } from "~~/config/const";

const nickname = defineModel<string>({
  required: true,
  set(string) {
    assert.ok(typeof string === "string");
    if (string.length > nicknameLength.max) {
      return string.slice(0, nicknameLength.max);
    }
    return string;
  },
});
</script>
