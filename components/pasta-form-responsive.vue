<template>
  <div class="flex flex-col gap-y-4 w-min">
    <pasta-form
      v-show="windowSize.width.value >= 1280"
      :pastaTags="pastaStore.tags"
      v-model:tag="pastaStore.tag"
      v-model:text="pastaStore.text"
      @createPastaEnterPressed="handlePastaCreation"
      @addTagToPasta="(tag) => handleTagAddToPasta(tag)"
      @removeAllTags="() => pastaStore.removeAllTags()"
      @removeTagFromPasta="(tag) => pastaStore.removeTag(tag)"
    >
      <template #header>
        <h2 class="text-3xl font-bold border-b p-1">
          Create pasta
          <!-- TODO onhover change img to basedge, xdd, aRolf ... -->
          <div class="relative inline-block">
            <img
              class="inline ml-1"
              src="https://cdn.7tv.app/emote/6306876cbe8c19d70f9d6b22/1x.webp"
              alt="Jokerge emote"
              @mouseover="shouldShowDisgustingAlert = true"
              @mouseout="shouldShowDisgustingAlert = false"
            />
            <img
              class="pointer-events-none absolute right-0 bottom-0 scale-150 -translate-y-1 -translate-x-[2.5px] motion-reduce:hidden"
              src="https://cdn.7tv.app/emote/6216d2f73808dfe5c465bc4a/1x.webp"
              alt="Alert emote"
              :hidden="!shouldShowDisgustingAlert"
            />
          </div>
        </h2>
      </template>
      <template #topLeftElement="props">
        <button
          :class="`focus-within:outline-${props.pastaLengthColor}`"
          class="btn btn-primary w-full text-lg h-max"
          @click="handlePastaCreation"
        >
          Create pasta
        </button>
      </template>
    </pasta-form>
    <pasta-form-before-xl
      v-show="windowSize.width.value < 1280"
      :pastaTags="pastaStore.tags"
      v-model:tag="pastaStore.tag"
      v-model:text="pastaStore.text"
      @createPastaEnterPressed="handlePastaCreation"
      @addTagToPasta="(tag) => handleTagAddToPasta(tag)"
      @removeAllTags="() => pastaStore.removeAllTags()"
      @removeTagFromPasta="(tag) => pastaStore.removeTag(tag)"
    >
      <template #header>
        <h2 class="text-3xl font-bold border-b p-1">
          Create pasta
          <!-- TODO onhover change img to basedge, xdd, aRolf ... -->
          <div class="relative inline-block">
            <img
              class="inline ml-1"
              src="https://cdn.7tv.app/emote/6306876cbe8c19d70f9d6b22/1x.webp"
              alt="Jokerge emote"
              @mouseover="shouldShowDisgustingAlert = true"
              @mouseout="shouldShowDisgustingAlert = false"
            />
            <img
              class="pointer-events-none absolute right-0 bottom-0 scale-150 -translate-y-1 -translate-x-[2.5px] motion-reduce:hidden"
              src="https://cdn.7tv.app/emote/6216d2f73808dfe5c465bc4a/1x.webp"
              alt="Alert emote"
              :hidden="!shouldShowDisgustingAlert"
            />
          </div>
        </h2>
      </template>
      <template #topLeftElement="props">
        <button
          :class="`focus-within:outline-${props.pastaLengthColor}`"
          class="btn btn-md btn-primary h-max"
          @click="handlePastaCreation"
        >
          Create pasta
        </button>
      </template>
    </pasta-form-before-xl>
    <user-settings />
  </div>
</template>
<script setup lang="ts">
const pastasStore = usePastasStore();
const pastaStore = usePastaStore();

const toast = useToast();
const windowSize = useWindowSize();

function handlePastaCreation<_E extends KeyboardEvent | MouseEvent>(
  _event: _E
) {
  pastasStore
    .createPasta({ tags: pastaStore.tags, text: pastaStore.text })
    .then(() => {
      pastaStore.clear();
      toast.add({
        description: "Pasta added successfully",
        title: "Pasta 🤙🤙🤙",
      });
    })
    .catch((error) => {
      if (!(error instanceof ExtendedError)) {
        throw error;
      }
      toast.add({
        description: error.message,
        title: "Pasta creation went wrong",
        color: "red",
        timeout: 10_000,
      });
    });
}

async function handleTagAddToPasta(tag: string) {
  try {
    await pastaStore.addTag(tag);
    pastaStore.tag = "";
  } catch (error) {
    if (!(error instanceof ExtendedError)) {
      throw error;
    }
    toast.add({
      description: error.description,
      title: error.title,
      color: error.color,
    });
  }
}

const shouldShowDisgustingAlert = ref(true);

onMounted(() => {
  setTimeout(() => {
    shouldShowDisgustingAlert.value = false;
  }, 3_000);
});

// const pastaFormRef = ref<HTMLElement>();

// defineExpose({
//   pastaFormRef
// })
</script>