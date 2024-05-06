<template>
  <article
    class="rounded-btn border-2 p-2 text-white"
    :class="[styles.backgroundBase, styles.borderAccent]"
  >
    <header class="flex justify-between">
      <h2 class="ml-1 text-xl">{{ integration.source }}</h2>
      <slot name="headingMiddle" />
      <emote-integration-logo :source="integration.source" with-link />
    </header>
    <main>
      <div v-if="integration.status === 'ready'" class="space-y-1.5">
        <ul class="space-y-1.5">
          <li v-for="set of integration.sets" :key="set.name">
            <emote-collection-collapsed-set :set :styles />
          </li>
        </ul>
        <div :class="styles.borderAccent" class="rounded-box border-2 p-2">
          <div class="flex justify-between">
            <emote-collection-formed-at :time="integration.formedAt" />
            <emote-collection-refresh-button
              size="xs"
              class="w-fit gap-0.5"
              :is-parent-refreshing="isRefreshing"
              @click="emit('refresh')"
            />
          </div>
          <div class="my-1 h-0 w-full border-t" :class="styles.borderAccent">
            &nbsp;
          </div>
          <emote-collection-global-integration-must-be-used
            v-model="checkedSources"
            :source
          />
        </div>
      </div>
      <div v-else-if="status === 'failed'">
        {{ reason }}
      </div>
    </main>
  </article>
</template>
<script setup lang="ts" generic="Source extends EmoteSource">
import type { EmoteSource } from "~/integrations";
import { collectionsStyles } from "~/components/emote-collection";
import { isReadyIntegration } from "~/integrations/integrations";
import type { SomeEmoteIntegration } from "~/integrations/integrations";

const checkedSources = defineModel<EmoteSource[]>("checkedSources", {
  required: true,
});

const props = defineProps<{
  integration: SomeEmoteIntegration<Source>;
}>();

const integration = computed(() => props.integration);

const emit = defineEmits<{
  refresh: [];
}>();
defineSlots<{
  headingMiddle?: unknown;
}>();

const styles = computed(() => collectionsStyles[source]);
</script>
