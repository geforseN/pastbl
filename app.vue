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
    <!--  -->
    <!-- NOTE: client only is used here because pastaStore and pastasStore persist data in localStorage, which is client only -->
    <!-- NOTE: for persist pinia-plugin-persistedstate is used, 
      for nuxt3 by default it uses cookie persist, but 
      for some reason, pasta with length over ~400 char is not saved in cookie,
      so because of that localStorage is used, which does not behave like that with long pasta text
    -->
    <client-only>
      <div class="grid grid-flow-row grid-cols-2 justify-items-center">
        <pasta-list>
          <user-nickname :user="userStore.user" />
        </pasta-list>
        <add-pasta @createPastaClick="(event: MouseEvent) => {
          pastasStore.createPasta({ tags: pastaStore.tags, text: pastaStore.text })
            .then(() => {
              pastaStore.clear();
            })
        }" />
        <user-settings class="col-start-2 col-span-1 row-start-2"></user-settings>
      </div>
    </client-only>
  </div>
</template>

<script setup lang="tsx" >


const pastasStore = usePastasStore();
const pastaStore = usePastaStore();
const userStore = useUserStore();
</script>
