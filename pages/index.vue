<template>
  <main
    class="mt-2 flex w-full flex-col items-center justify-center gap-x-12 gap-y-4 go-brr:flex-row go-brr:items-start"
  >
    <!-- NOTE: client only is used here because pastaStore and pastasStore persist data in localStorage, which is client only -->
    <!-- NOTE: for persist pinia-plugin-persistedstate is used, 
        for nuxt3 by default it uses cookie persist, but 
        for some reason, pasta with length over ~400 char is not saved in cookie, so 
        localStorage is used for persist, which does not behave like that with long pasta text
      -->
    <!-- <div class="loading loading-spinner animate-pulse" v-if="!isMounted"></div> -->

    <div class="flex flex-col-reverse go-brr:flex-col">
      <client-only>
        <chat-pasta-list>
          <template #user-nickname>
            <chat-pasta-nickname :user="userStore.user" />
          </template>
        </chat-pasta-list>
        <button
          class="btn btn-primary sticky top-2 my-2 w-full text-xl go-brr:bottom-2"
          @click="
              () => {
                (pastaFormRef as any).twitchChatRef.textareaRef.focus();
              }
            "
        >
          go create pasta
        </button>
        <template #fallback>LOADING LIST AND BUTTON</template>
      </client-only>
    </div>
    <div class="flex w-min flex-col gap-y-4">
      <client-only>
        <pasta-form-responsive ref="pastaFormRef" />
        <load-emote-collection-form />
        <user-settings />
        <template #fallback>LOADING FORMS</template>
      </client-only>
    </div>
  </main>
</template>

<script setup lang="tsx">
useHead({ title: "pastbl" });

const pastaFormRef = ref();
const userStore = useUserStore();

onMounted(async () => {});
</script>
<style>
html,
body {
  scrollbar-gutter: stable;
}
</style>
