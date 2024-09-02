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
        <ready-emote-integration-only :="integration" #="{ integration }">
          <ul class="space-y-1.5">
            <li v-for="set of integration.sets" :key="set.name">
              <emote-integration-collapsed-set :set :styles />
            </li>
          </ul>
        </ready-emote-integration-only>
        <div :class="styles.borderAccent" class="rounded-box border-2 p-2">
          <div class="flex justify-between">
            <state-emote-integration-only :="integration" #="{ integration }">
              <emote-collection-formed-at :time="integration.formedAt" />
            </state-emote-integration-only>
            <failed-emote-integration-only :="integration" #="{ integration }">
              <span class="italic">
                {{ integration.reason }}
              </span>
            </failed-emote-integration-only>
            <state-emote-integration-only
              :="integration"
              #="{ integration, isRefreshing }"
            >
              <refresh-button
                size="xs"
                class="w-fit gap-0.5"
                :is-in-process="isRefreshing(integration)"
                @click="$emit('update' /* refresh */)"
              />
            </state-emote-integration-only>
            <no-state-emote-integration-only
              :="integration"
              #="{ integration, isLoading }"
            >
              <load-button
                size="xs"
                class="w-fit gap-0.5 text-white hover:text-secondary-content"
                :class="[styles.backgroundBase, styles.borderAccent]"
                :is-in-process="isLoading(integration)"
                @click="$emit('update' /* load */)"
              />
            </no-state-emote-integration-only>
          </div>
          <div class="my-1 h-0 w-full border-t" :class="styles.borderAccent">
            &nbsp;
          </div>
          <global-emotes-integration-must-be-used v-model="checkedSources" />
        </div>
      </div>
    </main>
  </article>
</template>
<script setup lang="ts" generic="Source extends EmoteSource">
const checkedSources = defineModel<EmoteSource[]>("checkedSources", {
  required: true,
});

const props = defineProps<{
  integration: TEmoteIntegrations.__Some__;
}>();

defineSlots<{
  headingMiddle?: VueSlot;
}>();

defineEmits<{
  update: [];
}>();

provideEmoteSource(props.integration);

const { source, styles } = useEmoteIntegration(props.integration);
</script>
