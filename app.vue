<template>
  <div class="relative">
    <v-header />
    <main
      class="flex flex-col gap-y-4 items-center min-[920px]:items-start min-[920px]:flex-row justify-center gap-x-12 w-full mt-2"
    >
      <!-- NOTE: client only is used here because pastaStore and pastasStore persist data in localStorage, which is client only -->
      <!-- NOTE: for persist pinia-plugin-persistedstate is used, 
        for nuxt3 by default it uses cookie persist, but 
        for some reason, pasta with length over ~400 char is not saved in cookie, so 
        localStorage is used for persist, which does not behave like that with long pasta text
      -->
      <client-only>
        <div class="flex flex-col-reverse min-[920px]:flex-col">
          <pasta-list>
            <template #default>
              <user-nickname :user="userStore.user" />
            </template>
          </pasta-list>
          <button
            class="my-2 btn btn-primary w-full text-xl"
            @click="
              () => {
                (pastaFromResponsiveRef as any).twitchChatRef.textareaRef.focus();
              }
            "
          >
            go create pasta
          </button>
        </div>
        <div class="flex flex-col gap-y-4 w-min">
          <pasta-form-responsive ref="pastaFromResponsiveRef" />
          <user-settings />
        </div>
      </client-only>
    </main>
    <u-notifications>
      <template #title="{ title }">
        <span class="text-xl" v-html="title" />
      </template>
      <template #description="{ description }">
        <span class="font-bold" v-html="description" />
      </template>
    </u-notifications>
  </div>
</template>

<script setup lang="tsx">
const pastaFromResponsiveRef = ref();
const userStore = useUserStore();
</script>
<style>
html,
body {
  scrollbar-gutter: stable;
}
</style>
