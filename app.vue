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
        <pasta-form-responsive />
      </client-only>
    </main>
    <u-notifications class="w-min sm:w-min">
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
const userStore = useUserStore();
</script>
