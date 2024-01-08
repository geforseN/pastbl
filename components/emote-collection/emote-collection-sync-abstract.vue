<template>
  <article>
    <header class="flex gap-x-2 text-xl font-medium">
      <h2>{{ props.source }}</h2>
      <div class="ml-auto"></div>
      <span v-if="props.error">❌</span>
      <span v-else>✅</span>
      <icon-emote-integration-logo :source="props.source" />
    </header>
    <main>
      <!-- use v-if -->
      <emote-collection-sets-abstract
        :source="props.source"
        v-bind="props.setProps"
      />
      <div v-if="props.error">
        {{ props.error.message }}
      </div>
    </main>
  </article>
</template>
<script setup lang="ts" generic="S extends AvailableEmoteSource">
import type {
  AvailableEmoteSource,
  BetterTTVSet,
  FrankerFaceZSet,
  I7TVSet,
} from "~/integrations";

type SetProps = {};

type Props = {
  source: S;
  error?: Error;
} & {
  setProps: SetProps;
};

const props = defineProps<Props>();
</script>
