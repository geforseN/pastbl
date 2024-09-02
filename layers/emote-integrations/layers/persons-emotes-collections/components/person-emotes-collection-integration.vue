<template>
  <article
    class="rounded-btn border-2 p-2 text-white"
    :class="[styles.backgroundBase, styles.borderAccent]"
    :data-integration-source="source"
  >
    <header class="flex justify-between">
      <div
        v-if="isString(integration?.owner?.pageAddress)"
        class="flex items-center"
      >
        <twitch-user-avatar
          target="_blank"
          class="size-7"
          :to="integration.owner.pageAddress"
          :twitch
          :size="28"
        />
        <nuxt-link :to="integration.owner.pageAddress" external target="_blank">
          <h2 class="link ml-1 text-xl">{{ source }}</h2>
        </nuxt-link>
      </div>
      <h2 v-else class="ml-1 text-xl">{{ source }}</h2>
      <emote-integration-logo :source with-link />
    </header>
    <main>
      <div class="space-y-1.5">
        <ul v-if="integration.status === 'ready'" class="space-y-1.5">
          <li v-for="set of integration.sets" :key="set.name">
            <emote-integration-collapsed-set :set :styles />
          </li>
        </ul>
        <div
          :class="styles.borderAccent"
          class="flex justify-between rounded-box border-2 p-1 px-2"
        >
          <ready-emote-integration-only :="integration" #="{ integration }">
            <emote-collection-formed-at :time="integration.formedAt" />
          </ready-emote-integration-only>
          <failed-emote-integration-only :="integration" #="{ integration }">
            <div>{{ integration.reason }}</div>
          </failed-emote-integration-only>
          <refresh-button
            size="xs"
            class="w-fit gap-0.5"
            :is-in-process="integration.status === 'refreshing'"
            @click="$emit('refresh')"
          />
        </div>
      </div>
    </main>
  </article>
</template>
<script setup lang="ts" generic="Source extends EmoteSource">
const props = defineProps<{
  integration: any; //SomeEmoteIntegration<Source>;
  twitch: PersonTwitch;
}>();

defineEmits<{
  refresh: [];
}>();

provide("integration", props.integration);

const source = computed(() => props.integration.source);

const styles = computed(() => emoteIntegrationsStyles[source.value]);
</script>
