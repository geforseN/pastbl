<template>
  <div class="h-full p-4 text-2xl">
    <form
      class="flex h-full flex-col gap-y-2 overflow-auto"
      @submit.prevent="onSubmit"
    >
      <textarea
        id="pasta-text"
        v-model="text"
        placeholder="Pasta text i18n"
        name="text"
        class="min-h-60 w-full resize-none bg-base-100 p-2 text-base-content caret-purple-900"
      />
      <div class="flex items-center justify-between px-2 py-1">
        <label
          for="is-public"
          class="grow cursor-pointer"
        >
          {{ $t("isPublic") }}
        </label>
        <input
          id="pasta-is-public"
          v-model="isPublic"
          type="checkbox"
          name="_is-public"
          class="checkbox-info checkbox checkbox-lg"
        />
      </div>
      <div class="flex justify-between gap-2">
        <input
          id="pasta-tag"
          v-model="tag"
          class="input min-w-0 grow bg-base-100 text-2xl text-base-content"
          placeholder="Tag i18n"
          type="text"
          @keypress.enter.prevent="addTag"
        />
        <button
          type="button"
          class="btn btn-secondary text-lg"
          @click="addTag"
        >
          {{ $t("addTag") }}
        </button>
      </div>
      <div
        v-if="tags.length > 0"
        class="flex flex-wrap gap-1"
      >
        <!-- eslint-disable vue/no-template-shadow -->
        <removable-pasta-tag
          v-for="tag in tags"
          :key="tag"
          :tag
          :close-button-attrs="{ title: $t('deleteTag') }"
          @remove="tags.splice(tags.indexOf(tag), 1)"
        />
        <!-- eslint-enable vue/no-template-shadow -->
      </div>
      <div class="flex w-full gap-2">
        <div class="ml-auto">
          <button
            type="submit"
            class="btn btn-primary btn-lg text-2xl"
          >
            {{ $t("publishPasta") }}
          </button>
        </div>
      </div>

      <div
        v-if="error"
        class="rounded border border-error bg-error p-2 font-bold text-error-content"
      >
        {{ error }}
      </div>
    </form>
  </div>
</template>
<script setup lang="ts">
import { _postPastaError, postPasta } from "~/utils/pastas";
import { $pushPasta } from "~/utils/pastas.store";
import RemovablePastaTag from "$ui/removable-pasta-tag.vue";

const error = ref<Error>();

const text = ref("");

const tag = ref("");
const tags = ref<string[]>([]);

const isPublic = ref(false);
const publicity = computed(() => (isPublic.value ? "public" : "private"));

function addTag() {
  tags.value.push(tag.value);
  tag.value = "";
}

async function onSubmit(event: Event) {
  try {
    if (!(event.currentTarget instanceof HTMLFormElement)) {
      throw new TypeError("event.currentTarget is not an HTMLFormElement");
    }
    const pasta = await postPasta({
      publicity: publicity.value,
      text: text.value,
      tags: tags.value,
    });
    $pushPasta({
      ...pasta,
      tags: pasta.tags.map((value) => ({ value })),
    });
    tags.value = [];
    text.value = "";
  } catch (_cause) {
    if (!(_cause instanceof Error)) {
      error.value = _postPastaError(_cause);
    } else {
      error.value = _cause;
    }
  }
}
</script>
