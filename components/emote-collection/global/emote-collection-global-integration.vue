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
      <div class="space-y-1.5">
        <ul v-if="canShowSets(integration)" class="space-y-1.5">
          <li v-for="set of integration.sets" :key="set.name">
            <emote-collection-collapsed-set :set :styles />
          </li>
        </ul>
        <div :class="styles.borderAccent" class="rounded-box border-2 p-2">
          <div class="flex justify-between">
            <emote-collection-formed-at
              v-if="hasFormedAt(integration)"
              :time="integration.formedAt"
            />
            <span v-else-if="hasReason(integration)" class="italic">
              {{ integration.reason }}
            </span>
            <span v-else>{{ $t("failed-to-load") }}</span>
            <refresh-button
              v-show="hasFormedAt(integration)"
              size="xs"
              class="w-fit gap-0.5"
              :is-in-process="integration.status === 'refreshing'"
              @click="emit('update')"
            />
            <load-button
              v-show="!hasFormedAt(integration)"
              size="xs"
              class="w-fit gap-0.5 text-white hover:text-secondary-content"
              :class="[styles.backgroundBase, styles.borderAccent]"
              :is-in-process="integration.status === 'loading'"
              @click="emit('update')"
            />
          </div>
          <div class="my-1 h-0 w-full border-t" :class="styles.borderAccent">
            &nbsp;
          </div>
          <emote-collection-global-integration-must-be-used
            v-model="checkedSources"
            :source="integration.source"
          />
        </div>
      </div>
    </main>
  </article>
</template>
<script setup lang="ts" generic="Source extends EmoteSource">
import type { EmoteSource } from "~/integrations";
import { emoteIntegrationsStyles } from "~/components/emote-collection";
import type { SomeEmoteIntegration } from "~/integrations/integrations";
import {
  canShowSets,
  hasFormedAt,
  hasReason,
} from "~/integrations/integrations";

const checkedSources = defineModel<EmoteSource[]>("checkedSources", {
  required: true,
});

const emit = defineEmits<{
  update: [];
}>();

defineSlots<{
  headingMiddle?: unknown;
}>();

const props = defineProps<{
  integration: SomeEmoteIntegration<Source>;
}>();
const integration = computed(
  () =>
    props.integration /* TODO: add useShownGlobalIntegration, which will allow to use integration (better encapsulation) */,
);
const styles = computed(
  () => emoteIntegrationsStyles[integration.value.source],
);
</script>
