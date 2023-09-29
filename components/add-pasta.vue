<template>
  <section class="border-2 rounded border-base-content p-2 h-max">
    <!-- FIXME: had strange bug, dynamic classes in template, -->
    <!-- which used computed below, did not wanted to get required style -->
    <!-- probably tailwind did not added classes in bundle -->
    <!-- 
      so  
      <span :class="`text-${pastaLengthColor}`">
        {{ pastaStore.text.length }}
      </span>
      did not have required color, text had base text color -->
    <div hidden class="focus-within:outline-error focus-within:outline-warning focus-within:outline-success" />
    <div hidden class="text-error text-warning text-success " />
    <!-- UPD: above two hidden div elements with proper classes are added to fix classes can not came into bundle  -->
    <h2 class="text-3xl font-bold mb-2 border-b p-2 relative">
      Create pasta
      <!-- TODO onhover change img to basedge, xdd, aRolf ... -->
      <div class="relative inline-block">
        <img class="inline ml-1" src="https://cdn.7tv.app/emote/6306876cbe8c19d70f9d6b22/1x.webp" alt="Jokerge emote">
        <img class="absolute right-0 bottom-0 scale-150 -translate-y-1 -translate-x-[2.5px] motion-reduce:hidden"
          src="https://cdn.7tv.app/emote/6216d2f73808dfe5c465bc4a/1x.webp" alt="Alert emote"
          :hidden="!shouldShowDisgustingAlert">
      </div>
    </h2>
    <div class="flex gap-x-2 max-h-[75vh]">
      <twitch-chat ref="twitchChatRef" v-model="pastaStore.text"
        @enter-pressed="emit('createPastaEnterPressed', $event)"></twitch-chat>
      <div class="flex flex-col justify-between w-40">
        <div class="flex flex-col items-center">
          <button :class="`focus-within:outline-${pastaLengthColor}`" class="btn btn-primary w-full text-lg h-max"
            @click="emit('createPastaClick', $event)">
            create pasta
          </button>
          <span>Pasta length:
            <span :class="`text-${pastaLengthColor}`">
              {{ pastaStore.text.length }}
            </span>
          </span>
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
  </section>
</template>

<script lang="ts" setup>
const pastaStore = usePastaStore()
const toast = useToast();

const emit = defineEmits<{
  createPastaClick: [event: MouseEvent];
  createPastaEnterPressed: [event: KeyboardEvent];
}>();

const twitchChatRef = ref<HTMLInputElement>();

defineExpose({ twitchChatRef })

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
    return 'error';
  }
  if (pastaStore.text.length > 500) {
    return 'warning';
  }
  return 'success';
})

const shouldShowDisgustingAlert = ref(true)

onMounted(() => {
  setTimeout(() => {
    shouldShowDisgustingAlert.value = false;
  }, 3_000)
})
</script>
