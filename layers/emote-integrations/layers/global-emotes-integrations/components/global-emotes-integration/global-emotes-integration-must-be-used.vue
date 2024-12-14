<template>
  <div class="flex items-center justify-between gap-2">
    <label :for="id">{{ $t("mustBeInPastas") }}</label>
    <input
      :id
      v-model="checkedSources"
      :name="id"
      type="checkbox"
      :value="source"
      class="checkbox-accent checkbox"
    />
  </div>
</template>
<script setup lang="ts">
import { toLowerCase } from "../../../../../../app/utils/string";
import { injectEmoteSource } from "../../../emote-sources/utils/provide-inject-emote-source";
import type { EmoteSource } from "../../../emote-sources/utils/external";

const checkedSources = defineModel<EmoteSource[]>();

const source = injectEmoteSource();

const id = `global-${toLowerCase(source)}-emotes-must-be-used`;
</script>
