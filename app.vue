<template>
  <div class="relative">
    <u-notifications>
      <template #title="{ title }">
        <span class="text-xl" v-html="title" />
      </template>
      <template #description="{ description }">
        <span class="font-bold" v-html="description" />
      </template>
    </u-notifications>
    <v-header />
    <!-- NOTE: client only is used here because pastaStore and pastasStore persist data in localStorage, which is client only -->
    <!-- NOTE: for persist pinia-plugin-persistedstate is used, 
      for nuxt3 by default it uses cookie persist, but 
      for some reason, pasta with length over ~400 char is not saved in cookie, so 
      localStorage is used for persist, which does not behave like that with long pasta text
    -->
    <client-only>
      <main
        class="flex flex-col gap-y-4 items-center lg:items-start lg:flex-row justify-center gap-x-12 w-full mt-2"
      >
        <div class="flex flex-col-reverse lg:flex-col">
          <pasta-list>
            <user-nickname :user="userStore.user" />
          </pasta-list>
          <button
            class="my-2 btn btn-primary w-full text-xl"
            @click="(addPastaRef as any).twitchChatRef.textareaRef.focus()"
          >
            go create pasta
          </button>
        </div>
        <div class="flex flex-col gap-y-4 w-min">
          <pasta-form
            ref="addPastaRef"
            :pastaTags="pastaStore.tags"
            v-model:tag="pastaStore.tag"
            v-model:text="pastaStore.text"
            @createPastaEnterPressed="handlePastaCreation"
            @addTagToPasta="(tag) => handleTagAddToPasta(tag)"
            @removeAllTags="() => pastaStore.removeAllTags()"
            @removeTagFromPasta="(tag) => pastaStore.removeTag(tag)"
          >
            <template #header>
              <h2 class="text-3xl font-bold mb-2 border-b p-2 relative">
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
          <user-settings />
        </div>
      </main>
    </client-only>
  </div>
</template>

<script setup lang="tsx">
const pastasStore = usePastasStore();
const pastaStore = usePastaStore();
const userStore = useUserStore();

const toast = useToast();

const addPastaRef = ref<HTMLElement>();

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
</script>
