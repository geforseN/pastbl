<template>
  <div
    class="collapse collapse-arrow border-2"
    :class="styles.borderAccent"
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
    <header
      :class="isOpen && 'mb-4'"
      class="collapse-title"
    >
      <slot name="title">
        <div class="flex items-baseline justify-between">
          <h3>
            {{ set.name }}
          </h3>
          <span class="text-sm">
            {{ t("emote", set.emotes.length) }}
          </span>
        </div>
      </slot>
    </header>
    <main class="collapse-content">
      <slot
        v-if="mustRenderContent"
        name="emoteList"
      >
        <div
          class="flex max-h-60 flex-wrap gap-1 overflow-y-auto border-t-2 p-2 scrollbar"
          :class="[styles.borderAccent, styles.scrollbar]"
          tabindex="0"
        >
          <div
            v-for="emote of set.emotes"
            :key="emote.id"
            class="grid min-h-8 place-items-center hover:scale-110 hover:outline hover:outline-1"
            :class="[styles.backgroundBase, styles.outlineAccent]"
            :title="emote.token + ' from ' + set.source"
          >
            <img
              :id="`${emote.id}:${emote.source}`"
              :data-emote-id="emote.id"
              :data-token="emote.token"
              :src="emote.url"
              :alt="emote.token"
              :width="emote.width || defaultEmoteSize.width"
              :height="emote.height || defaultEmoteSize.height"
              class="m-0.5 inline-block"
              loading="lazy"
            />
          </div>
        </div>
      </slot>
    </main>
  </div>
</template>
<script setup generic="EmoteSetT extends IEmoteSet">
const isOpen = ref(false);
const mustRenderContent = ref(false);

const { t } = useI18n({
  pluralRules,
  messages: {
    ru: {
      emote: "нет эмоутов | {n} эмоут | {n} эмоута | {n} эмоутов",
    },
    en: {
      emote: "no emotes | {n} emote | {n} emotes",
    },
  },
});

const props = withDefaults(
  defineProps<{
    set: EmoteSetT;
    styles: EmoteIntegrationStyle;
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
  title: VueSlot;
  emoteList: VueSlot;
}>();

const id = computed(
  () =>
    "is-"
    + dasherize(props.set.source)
    + "-"
    + dasherize(props.set.name)
    + "-collapse-open",
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
