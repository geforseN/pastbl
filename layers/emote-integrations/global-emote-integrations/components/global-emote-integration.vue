<template>
  <article
    class="rounded-btn border-2 p-2 text-white"
    :class="[styles.backgroundBase, styles.borderAccent]"
  >
    <header class="flex justify-between">
      <h2 class="ml-1 text-xl">{{ source }}</h2>
      <slot name="headingMiddle" />
      <emote-integration-logo :source with-link />
    </header>
    <main>
      <div class="space-y-1.5">
        <ul v-if="integration" class="space-y-1.5">
          <li v-for="set of integration.sets" :key="set.name">
            <emote-integration-collapsed-set :set :styles />
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
          <global-emote-integration-must-be-used
            v-model="checkedSources"
            :source
          />
        </div>
      </div>
    </main>
  </article>
</template>
<script setup lang="ts" generic="Source extends EmoteSource">
import type { TEmoteIntegrations } from "$/emote-integrations/base/EmoteIntegration";

const checkedSources = defineModel<EmoteSource[]>("checkedSources", {
  required: true,
});

const props = defineProps<TEmoteIntegrations.Global.Of<Source>>();

defineEmits<{
  update: [];
}>();

defineSlots<{
  headingMiddle?: unknown;
}>();

const { source, styles } = useGlobalEmoteIntegration(computed(() => props));
</script>
