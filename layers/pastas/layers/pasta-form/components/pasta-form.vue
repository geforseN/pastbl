<template>
  <form
    class="space-y-2"
    @submit.prevent="
      () => {
        log('debug', '<pasta-form /> submit');
      }
    "
  >
    <div class="flex flex-col gap-2 xl:w-full xl:flex-row xl:justify-between">
      <pasta-form-textarea
        id="twitch-chat-textarea"
        ref="pastaFormTextarea"
        v-model="pastaTextModel"
        :model-status="pastaStatus"
        class="mx-0.5"
        @submit="mainEmit"
      />
      <client-only>
        <pasta-form-is-pasta-public-checkbox-control
          v-show="userStore.pastasWorkMode.isRemote"
          v-model="isPublic"
          class="-mb-2 ml-1.5 flex items-center gap-1 xl:hidden"
        />
      </client-only>
      <div
        class="flex flex-row-reverse items-center justify-between gap-1 xl:w-full xl:flex-col"
      >
        <button
          class="btn btn-primary h-max text-lg focus:outline-double focus:outline-4 focus:outline-offset-1 xl:w-full"
          @click="mainEmit"
        >
          {{
            $t(
              userStore.pastasWorkMode.isLocal
                ? "pasta.create"
                : "pasta.publish",
            )
          }}
        </button>
        <div class="flex h-full flex-col justify-between">
          <pasta-form-pasta-length
            :pasta-text-status="pastaStatus"
            :pasta-text="trimmedText"
          />
          <client-only />
          <pasta-form-is-pasta-public-checkbox-control
            v-show="userStore.pastasWorkMode.isRemote"
            v-model="isPublic"
            class="hidden xl:ml-1.5 xl:flex xl:items-center xl:gap-1"
          />
          <button
            v-if="pastaTags.length > 0"
            class="btn btn-error btn-sm"
            @click="emit('removeAllTags')"
          >
            {{ $t("tags.remove") }}
          </button>
          <span
            v-else
            class="badge badge-warning badge-lg"
          >
            {{ $t("tags.noAdded") }}
          </span>
        </div>
      </div>
    </div>
    <pasta-form-tags
      class="xs:max-w-screen-xs"
      :tags="pastaTags"
      @remove-tag="(tag) => emit('removeTag', tag)"
    />
    <pasta-form-tags-input
      v-model="tagToAddModel"
      @add-tag="(tag) => emit('addTag', tag)"
    >
      <template #addTagSuggestions>
        <!--   NOTE: TRIED to use <option :value="tag" ...otherAttrs><{{'important message'}}/option>
        but it did fail because firefox showed slot value only (no 'important message'), which is not what wanted
        chrome however works great, showing value attribute with smaller slot text below
        SO implemented <option /> uses value, label and no slot, which works ok:
        firefox shows label only, value used onclick
        chrome shows value and label below, value used onclick -->
        <option
          v-for="[tag, count] of hintedTagsMap"
          :key="tag"
          :value="tag"
          :label="$t('pasta.tags.hint', { tag, count })"
        />
      </template>
    </pasta-form-tags-input>
  </form>
</template>
<script setup lang="ts">
import {
  PastaFormPastaLength,
  PastaFormTags,
  PastaFormTagsInput,
  PastaFormTextarea,
  PastaFormIsPastaPublicCheckboxControl,
} from "#components";

const userStore = useUserStore();

const tagToAddModel = defineModel<string>("tag", { default: "" });
const pastaTextModel = defineModel<string>("text", { required: true });
const isPublic = defineModel<boolean>("isPublic", { required: true });

const trimmedText = ref(pastaTextModel.value);
watchDebounced(
  pastaTextModel,
  (text) => {
    trimmedText.value = megaTrim(text);
  },
  { debounce: 200 },
);

defineProps<{
  pastaTags: string[];
  hintedTagsMap: [tagValue: string, tagCount: number][];
}>();

const emit = defineEmits<{
  addTag: [string];
  removeTag: [string];
  removeAllTags: [];
  createPasta: [];
  publishPasta: [];
}>();

const mainEmit = () =>
  userStore.pastasWorkMode.isLocal ? emit("createPasta") : emit("publishPasta");

const pastaFormTextareaRef = useTemplateRef("pastaFormTextarea");

defineExpose({
  pastaFormTextareaRef,
});

const pastaStatus = computed(() => getTextStatus(trimmedText));
</script>
