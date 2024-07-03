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
        <ul v-if="integration" class="space-y-1.5">
          <li v-for="set of integration.sets" :key="set.name">
            <emote-collection-collapsed-set :set :styles />
          </li>
        </ul>
        <div :class="styles.borderAccent" class="rounded-box border-2 p-2">
          <div class="flex justify-between">
            <emote-collection-formed-at
              v-if="integration.hasFormedAt()"
              :time="integration.formedAt"
            />
            <span v-else-if="integration.hasReason()" class="italic">
              {{ integration.reason }}
            </span>
            <span v-else>{{ $t("failed-to-load") }}</span>
            <refresh-button
              v-show="integration.hasFormedAt()"
              size="xs"
              class="w-fit gap-0.5"
              :is-in-process="integration.isRefreshing()"
              @click="$emit('update')"
            />
            <load-button
              v-show="!integration.hasFormedAt()"
              size="xs"
              class="w-fit gap-0.5 text-white hover:text-secondary-content"
              :class="[styles.backgroundBase, styles.borderAccent]"
              :is-in-process="integration.isLoading()"
              @click="$emit('update')"
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
import { emoteIntegrationsStyles } from "~~/layers/emotes/components/emote-collection";
import type { EmoteSource } from "~~/layers/emote-integrations";
import type { TEmoteIntegrations } from "~~/layers/emote-integrations/abstract";

const checkedSources = defineModel<EmoteSource[]>("checkedSources", {
  required: true,
});

const props = defineProps<{
  integration: TEmoteIntegrations.Global.Of<Source>;
}>();

defineEmits<{
  update: [];
}>();

defineSlots<{
  headingMiddle?: unknown;
}>();

const styles = computed(
  () =>
    emoteIntegrationsStyles[props.integration.source] ||
    raise("Styles not found"),
);

class GlobalEmotesIntegration {
  constructor(
    private readonly integration: TEmoteIntegrations.Global.SettledOfSource<Source>,
  ) {}

  get source() {
    return this.integration.source;
  }

  isRefreshing() {
    return this.integration.status === "refreshing";
  }

  isLoading() {
    return this.integration.status === "loading";
  }

  canShowSets() {
    return (
      (this.integration.status === "ready" ||
        this.integration.status === "refreshing") &&
      Boolean(this.integration.sets)
    );
  }

  get sets() {
    return this.integration.sets;
  }

  hasFormedAt() {
    return Boolean(this.integration.formedAt);
  }

  get formedAt() {
    return this.integration.formedAt;
  }

  hasReason() {
    return Boolean(this.integration.reason);
  }

  get reason() {
    return this.integration.reason;
  }
}

const integration = computed(
  () => new GlobalEmotesIntegration(props.integration),
);
</script>
