<template>
  <article
    class="rounded-btn border-2 p-2 text-white"
    :class="[styles.backgroundBase, styles.borderAccent]"
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
            :colors="styles"
          />
        </div>
        <div
          :class="styles.borderAccent"
          class="flex justify-between rounded-box border-2 p-1 px-2"
        >
          <emote-collection-formed-at :time="props.collection.formedAt" />
          <emote-collection-refresh-button
            size="xs"
            class="w-fit gap-0.5"
            :is-refreshing="props.isRefreshing"
            @click="emit('refresh')"
          />
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
  type UserIntegrationProps,
} from "~/components/emote-collection";

const props = defineProps<UserIntegrationProps<Source>>();
const emit = defineEmits<{
  refresh: [];
}>();

const styles = computed(() => collectionsStyles[props.source]);
</script>
