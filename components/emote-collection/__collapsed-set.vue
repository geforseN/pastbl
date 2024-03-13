<template>
  <div
    class="collapse collapse-arrow border-2"
    :class="props.colors.borderAccent"
  >
    <input
      :id="id"
      v-model="isOpen"
      type="checkbox"
      :name="id"
      @input="mustRenderContent = true"
      @keypress.enter.exact="
        mustRenderContent = true;
        isOpen = !isOpen;
      "
    />
    <header :class="isOpen && 'mb-4'" class="collapse-title">
      <slot name="title">
        <div class="flex items-baseline justify-between">
          <h3>
            {{ props.set.name }}
          </h3>
          <span class="text-sm">
            {{ $t("collections.emotes", props.set.emotes.length) }}
          </span>
        </div>
      </slot>
    </header>
    <main class="collapse-content">
      <slot v-if="mustRenderContent" name="emoteList">
        <div
          class="flex max-h-60 flex-wrap gap-1 overflow-y-auto border-t-2 p-2 scrollbar"
          :class="[props.colors.borderAccent, props.colors.scrollbar]"
          tabindex="0"
        >
          <div
            v-for="emote of props.set.emotes"
            :key="emote.id"
            class="grid min-h-8 place-items-center hover:scale-110 hover:outline hover:outline-1"
            :class="[props.colors.backgroundBase, props.colors.outlineAccent]"
            :title="emote.token + ' from ' + props.set.source"
          >
            <img
              :id="`${emote.id}:${emote.source}`"
              :data-emote-id="emote.id"
              :data-token="emote.token"
              :src="emote.url"
              :alt="emote.token"
              :width="emote.width || props.defaultEmoteSize.width"
              :height="emote.height || props.defaultEmoteSize.height"
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
import type { CollectionStyle } from "~/components/emote-collection";
import type { IEmoteSetT } from "~/integrations";

const isOpen = ref(false);
const mustRenderContent = ref(false);
const props = withDefaults(
  defineProps<{
    set: EmoteSetT;
    colors: CollectionStyle;
    defaultEmoteSize?: {
      width?: number;
      height?: number;
    };
  }>(),
  {
    defaultEmoteSize: (props) => ({
      width: props.defaultEmoteSize?.width ?? 32,
      height: props.defaultEmoteSize?.height ?? 32,
    }),
  },
);

defineSlots<{
  title: () => unknown;
  emoteList: () => unknown;
}>();

const id = computed(
  () => "is-" + props.set.source + "-" + props.set.name + "-collapse-open",
);
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
