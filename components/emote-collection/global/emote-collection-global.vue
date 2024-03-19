<template>
  <article
    class="rounded-btn border-2 p-2 text-white"
    :class="[styles.backgroundBase, styles.borderAccent]"
  >
    <header class="flex justify-between">
      <h2 class="ml-1 text-xl">{{ props.source }}</h2>
      <slot name="headingMiddle" />
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
            :colors="styles"
          />
        </div>
        <div :class="styles.borderAccent" class="rounded-box border-2 p-2">
          <div class="flex justify-between">
            <emote-collection-updated-at :time="props.collection.updatedAt" />
            <emote-collection-refresh-button
              size="xs"
              class="w-fit gap-0.5"
              :is-refreshing="props.isRefreshing"
              @click="emit('refresh')"
            />
          </div>
          <div class="my-1 h-0 w-full border-t" :class="styles.borderAccent">
            &nbsp;
          </div>
          <div class="flex items-center justify-between gap-2">
            <label :for="mustBeUsedId">{{ $t("mustBeInPastas") }}</label>
            <input
              :id="mustBeUsedId"
              v-model="checkedSources"
              :name="mustBeUsedId"
              type="checkbox"
              :value="props.source"
              class="checkbox-accent checkbox"
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
  collectionsStyles,
  type GlobalCollectionProps,
} from "~/components/emote-collection";

const checkedSources = defineModel<EmoteSource[]>("checkedSources", {
  required: true,
});
const props = defineProps<GlobalCollectionProps<Source>>();
const emit = defineEmits<{
  refresh: [];
}>();
defineSlots<{
  headingMiddle?: unknown;
}>();

const styles = computed(() => collectionsStyles[props.source]);

const mustBeUsedId = computed(
  () => "global-" + props.source.toLowerCase() + "-emotes-must-be-used",
);
</script>
