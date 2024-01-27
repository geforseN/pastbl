<template>
  <article
    class="rounded-btn border-2 p-2 text-white"
    :class="colors.background + ' ' + colors.border"
  >
    <header class="flex justify-between">
      <h2 class="ml-1 text-xl">{{ props.source }}</h2>
      <icon-emote-integration-logo
        :source="props.source"
        :must-wrap-to-link="true"
      />
    </header>
    <main>
      <div v-if="props.status === 'ready'" class="flex flex-col gap-1.5">
        <div class="flex flex-col gap-1.5">
          <emote-collection-global-collapsed-set
            v-for="set of props.collection.sets"
            :key="set.name"
            :set="set"
            :colors="colors"
          />
        </div>
        <div
          :class="colors.border"
          class="flex flex-col rounded-box border-2 p-2"
        >
          <emote-collection-global-updated-at
            :updated-at="props.collection.updatedAt"
            :colors="colors"
            @refresh="emit('refresh')"
          />
          <span class="my-1 h-0 w-full border-t" :class="colors.border">
            &nbsp;
          </span>
          <emote-collection-global-must-be-used
            v-model="checkedSources"
            :source="props.source"
            :colors="colors"
          />
        </div>
      </div>
      <div v-else-if="props.status === 'failed'">
        {{ props.reason }}
      </div>
      <div v-else-if="props.status === 'loading'">Loading...</div>
    </main>
  </article>
</template>
<script setup lang="ts" generic="SourceT extends EmoteSource">
import type {
  EmoteSource,
  IGlobalEmoteCollectionRecord as SourceToIntegration,
} from "~/integrations";

export type Colors = {
  border: string;
  background: string;
  outline: string;
  asd: string;
};

const colorsClassRecord: Record<EmoteSource, Colors> = {
  BetterTTV: {
    border: "border-[#63b3ed]",
    background: "bg-[#181d1f]",
    outline: "outline-[#63b3ed]",
    asd: "bg-[#63b3ed]",
  },
  FrankerFaceZ: {
    border: "border-ffz",
    background: "bg-[#222222]",
    outline: "outline-ffz",
    asd: "bg-ffz",
  },
  SevenTV: {
    border: "border-[#2599cd]",
    background: "bg-[#181d1f]",
    outline: "outline-[#2599cd]",
    asd: "bg-[#2599cd]",
  },
  Twitch: {
    border: "border-[#a970ff]",
    background: "bg-[#0E0E10]",
    outline: "outline-[#a970ff]",
    asd: "bg-[#a970ff]",
  },
};

type Props = {
  source: SourceT;
  status: "ready" | "failed" | "loading";
  collection?: SourceToIntegration[SourceT];
  reason?: string;
} & (
  | {
      status: "ready";
      collection: SourceToIntegration[SourceT];
    }
  | {
      status: "failed";
      reason: string;
    }
  | {
      status: "loading";
    }
);

const checkedSources = defineModel("checkedSources", {
  required: true,
  type: Array<EmoteSource>,
});
const props = defineProps<Props>();
const emit = defineEmits<{
  refresh: [];
}>();

const colors = computed(() => colorsClassRecord[props.source]);
</script>
