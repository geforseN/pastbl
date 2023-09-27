<template>
  <div v-if="pastasStore.isLoaded_" class="bg-red-900">LOADING</div>
  <template v-else>
    <div v-if="pastasStore.pastas.length === 0" class="justify-self-center mt-4">
      NO PASTAS
    </div>
    <div v-else class="w-[340px]" >
      <v-pasta :pasta="pasta" v-for="pasta of pastasStore.pastas">
        <slot />
      </v-pasta>
    </div>
  </template>
</template>

<script setup lang="ts" >
const pastasStore = usePastasStore()
</script>
