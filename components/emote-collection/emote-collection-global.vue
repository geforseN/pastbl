<template>
  <article
    class="rounded-btn border-2 p-2 text-white"
    :class="colors.background + ' ' + colors.border"
  >
    <header class="flex justify-between">
      <h2 class="ml-1 text-xl">{{ props.source }}</h2>
      <emote-integration-logo
        :source="props.source"
        :must-wrap-to-link="true"
      />
    </header>
    <main>
      <div v-if="props.status === 'ready'" class="flex flex-col gap-1.5">
        <div class="flex flex-col gap-1.5">
          <emote-collection-collapsed-set
            v-for="set of props.collection.sets"
            :key="set.name"
            :set="set"
            :colors="colors"
          />
        </div>
        <div
          :class="colors.border"
          class="flex flex-col rounded-box border-2 p-2"
        >
          <emote-collection-updated-at
            :updated-at="props.collection.updatedAt"
            @refresh="emit('refresh')"
          />
          <span class="my-1 h-0 w-full border-t" :class="colors.border">
            &nbsp;
          </span>
          <div class="flex items-center justify-between gap-2">
            <label :for="mustBeUsedId">Should be used in pastas</label>
            <input
              :id="mustBeUsedId"
              v-model="checkedSources"
              :name="mustBeUsedId"
              type="checkbox"
              :value="props.source"
              class="checkbox-success checkbox"
            />
          </div>
        </div>
      </div>
      <div v-else-if="props.status === 'failed'">
        {{ props.reason }}
      </div>
    </main>
  </article>
</template>
<script setup lang="ts" generic="Source extends EmoteSource">
import type { EmoteSource } from "~/integrations";
import {
  colorsClassRecord,
  type GlobalCollectionProps,
} from "~/components/emote-collection";

const checkedSources = defineModel("checkedSources", {
  required: true,
  type: Array<EmoteSource>,
});
const props = defineProps<GlobalCollectionProps<Source>>();
const emit = defineEmits<{
  refresh: [];
}>();

const colors = colorsClassRecord[props.source];

const mustBeUsedId =
  "global-" + props.source.toLowerCase() + "-emotes-must-be-used";
</script>
