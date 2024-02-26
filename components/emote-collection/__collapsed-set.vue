<template>
  <div class="collapse collapse-arrow border-2" :class="props.colors.border">
    <input
      :id="id"
      v-model="isCollapseOpen"
      type="checkbox"
      :name="id"
      @input="mustRenderContent = true"
      @keypress.enter.exact="
        mustRenderContent = true;
        isCollapseOpen = !isCollapseOpen;
      "
    />
    <header :class="isCollapseOpen && 'mb-4'" class="collapse-title">
      <slot name="title">
        <div class="flex items-baseline justify-between">
          <h3 class="">
            {{ props.set.name }}
          </h3>
          <span class="text-sm">
            {{ props.set.emotes.length }}
            emotes
          </span>
        </div>
      </slot>
    </header>
    <main class="collapse-content">
      <slot v-if="mustRenderContent" name="emoteList">
        <div
          class="flex max-h-60 flex-wrap gap-1 overflow-y-auto border-t-2 p-2"
          :class="props.colors.border"
          tabindex="0"
        >
          <div
            v-for="emote of props.set.emotes"
            :key="emote.id"
            class="grid min-h-8 place-items-center hover:scale-110 hover:outline hover:outline-1"
            :class="props.colors.background + ' ' + props.colors.outline"
            :title="emote.token + ' from ' + props.set.source"
          >
            <img
              :id="`${emote.id}:${emote.source}`"
              :data-emote-id="emote.id"
              :src="emote.url"
              :alt="emote.token"
              :width="emote.width || 32"
              :height="emote.height || 32"
              class="m-0.5 inline-block"
              loading="lazy"
            />
          </div>
        </div>
      </slot>
    </main>
  </div>
</template>
<script lang="ts" setup generic="EmoteSetT extends IEmoteSetT">
import type { Colors } from "~/components/emote-collection";
import type { IEmoteSetT } from "~/integrations";

const isCollapseOpen = ref(false);
const mustRenderContent = ref(false);
const props = defineProps<{
  set: EmoteSetT;
  colors: Colors;
}>();

defineSlots<{
  title: () => unknown;
  emoteList: () => unknown;
}>();

const id = "is-" + props.set.source + "-" + props.set.name + "-collapse-open";
</script>
<style scoped>
.collapse-title,
:where(.collapse > input[type="checkbox"]),
:where(.collapse > input[type="radio"]) {
  min-height: auto;
  padding: 0.25rem 0.5rem;
  padding-right: 2rem;
}

.collapse-title::after {
  margin: -0.75rem -0.5rem;
}

.collapse-content {
  margin-top: -1rem;
  padding: 0;
}
</style>
