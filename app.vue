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
      for some reason, pasta with length over ~400 char is not saved in cookie, so 
      localStorage is used for persist, which does not behave like that with long pasta text
    -->
    <client-only>
      <div class="flex justify-center gap-x-12 w-full mt-2">
        <pasta-list>
          <user-nickname :user="userStore.user" />
        </pasta-list>
        <div class="flex flex-col gap-y-4">
          <add-pasta @createPastaClick="handlePastaCreation" @createPastaEnterPressed="handlePastaCreation" />
          <user-settings />
        </div>
      </div>
    </client-only>
  </div>
</template>

<script setup lang="tsx" >
const toast = useToast()

const pastasStore = usePastasStore();
const pastaStore = usePastaStore();
const userStore = useUserStore();

function handlePastaCreation<E extends KeyboardEvent | MouseEvent>(_event: E) {
  pastasStore.createPasta({ tags: pastaStore.tags, text: pastaStore.text })
    .then(() => {
      pastaStore.clear();
      toast.add({ description: 'Pasta added successfully', title: 'Pasta 🤙🤙🤙' })
    }).catch((error) => {
      if (!(error instanceof ExtendedError)) {
        throw error
      }
      toast.add({ description: error.message, title: 'Pasta creation went wrong', color: 'red', timeout: 10_000 })
    })
}
</script>
