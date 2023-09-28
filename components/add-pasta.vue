<template>
  <div class="border-2 rounded border-base-content p-2 h-max">
    <div class="flex gap-x-2 max-h-[75vh]">
      <div class="flex flex-col w-max">
        <twitch-chat v-model="pastaStore.text" @enter-pressed="emit('createPastaEnterPressed', $event)"></twitch-chat>
      </div>
      <div class="flex flex-col justify-between w-40">
        <div class="flex flex-col items-center">
          <button :class="`focus-within:outline-${pastaLengthColor}`" class="btn btn-primary w-full text-lg h-max"
            @click="emit('createPastaClick', $event)">
            create pasta
          </button>
          <div class="">
            <span>Pasta length: </span>
            <span :class="`text-${pastaLengthColor}`">
              {{ pastaStore.text.length }}
            </span>
          </div>
        </div>
        <div class="flex flex-col gap-y-2">
          <added-tags @remove-tag="tag => pastaStore.removeTag(tag)" :tags="pastaStore.tags" />
          <button v-if="pastaStore.tags.length !== 0" class="btn btn-sm btn-error" @click="pastaStore.removeAllTags">
            remove all tags
          </button>
        </div>
      </div>
    </div>
    <add-pasta-tags class="mb-2" v-model="pastaStore.tag" @add-tag="(tag = pastaStore.tag) => handleTagAddToPasta(tag)" />
  </div>
</template>

<script lang="ts" setup>
const pastaStore = usePastaStore()
const toast = useToast();

const emit = defineEmits<{
  createPastaClick: [event: MouseEvent];
  createPastaEnterPressed: [event: KeyboardEvent];
}>();

async function handleTagAddToPasta(tag: string) {
  try {
    await pastaStore.addTag(tag)
    pastaStore.tag = ''
  } catch (error) {
    if (!(error instanceof ExtendedError)) {
      throw error
    }
    toast.add({
      description: error.description,
      title: error.title,
      color: error.color
    });
  }
}

// FIXME: had strange bug, dynamic classes in template,
// which used computed below, did not wanted to get required style
// probably tailwind did not added classes in bundle
// so {{ pastaStore.text.length }} did not have required color, text had base text color 
const pastaLengthColor = computed(() => {
  if (pastaStore.text.length === 0 || pastaStore.text.length > 1000) {
    return 'error';
  }
  if (pastaStore.text.length > 500) {
    return 'warning';
  }
  return 'success';
})
</script>

<style scoped>
.text {
  overflow-wrap: anywhere;
  text-size-adjust: 100%;
  font-family: Inter, Roobert, "Helvetica Neue", Helvetica, Arial, sans-serif;
}
</style>