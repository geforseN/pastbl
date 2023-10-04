<template>
  <div class="relative">
    <v-header />
    <main
      class="mt-2 flex w-full flex-col items-center justify-center gap-x-12 gap-y-4 go-brr:flex-row go-brr:items-start"
    >
      <!-- NOTE: client only is used here because pastaStore and pastasStore persist data in localStorage, which is client only -->
      <!-- NOTE: for persist pinia-plugin-persistedstate is used, 
        for nuxt3 by default it uses cookie persist, but 
        for some reason, pasta with length over ~400 char is not saved in cookie, so 
        localStorage is used for persist, which does not behave like that with long pasta text
      -->
      <client-only>
        <div class="flex flex-col-reverse go-brr:flex-col">
          <pasta-list>
            <template #user-nickname>
              <user-nickname :user="userStore.user" />
            </template>
          </pasta-list>
          <button
            class="btn btn-primary my-2 w-full text-xl"
            @click="
              () => {
                (pastaFromResponsiveRef as any).twitchChatRef.textareaRef.focus();
              }
            "
          >
            go create pasta
          </button>
        </div>
        <div class="flex w-min flex-col gap-y-4">
          <pasta-form-responsive ref="pastaFromResponsiveRef" />
          <user-settings />
        </div>
      </client-only>
    </main>
    <u-notifications>
      <template #title="{ title }">
        <span class="text-xl">{{ title }}</span>
      </template>
      <template #description="{ description }">
        <span class="font-bold">{{ description }}</span>
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
