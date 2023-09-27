<template>
  <div class="border-2 rounded border-base-content p-2 h-max">
    <div class="flex gap-x-2">
      <div class="flex flex-col w-max">
        <textarea v-model="pastaStore.text" placeholder="Enter a pasta"
          @keyup.enter="emit('createPastaEnterPressed', $event)"
          class="w-80 h-[60vh] max-h-[75vh] text box-content textarea leading-[19.5px] text-[13px] font-normal placeholder:text-lg placeholder:text-base-content caret-[#a970ff] leading-3 rounded focus-within:outline-[#a970ff] focus-within:outline-offset-0 focus-within:outline-4 border-base-content border-2 px-[16px] py-[8px] hover:px-[15px] hover:py-[7px] hover:border-[3px]" />
      </div>
      <div class="flex flex-col justify-between w-40">
        <div class="flex flex-col items-center">
          <button :class="`focus-within:outline-${pastaLengthColor}`" class="btn btn-primary w-full text-lg h-max"
            @click="emit('createPastaClick', $event)">
            create pasta
          </button>
          <div class="">
            <span>Symbols count: </span>
            <span :class="`text-${pastaLengthColor}`">
              {{ pastaStore.text.length }}</span>

          </div>
        </div>
        <div class="flex flex-col gap-y-2">
          <added-tags @remove-tag="tag => pastaStore.removeTag(tag)" :tags="pastaStore.tags" />
          <button v-if="pastaStore.tags.length !== 0" class="btn btn-sm btn-error" @click="pastaStore.removeAllTags">
            remove all tags</button>
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
  createPastaEnterPressed: [event: KeyboardEvent]
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

const pastaLengthColor = computed(() => {
  if (pastaStore.text.length === 0 || pastaStore.text.length > 1000) {
    return 'error'
  }
  if (pastaStore.text.length > 500) {
    return 'warning'
  }
  return 'success'
})
</script>

<style scoped>
.text {
  overflow-wrap: anywhere;
  text-size-adjust: 100%;
  font-family: Inter, Roobert, "Helvetica Neue", Helvetica, Arial, sans-serif;
}
</style>