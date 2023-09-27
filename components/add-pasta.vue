<template>
  <div class="border border-red-400 p-2">
    <add-pasta-tags class="mb-2" />
    <div class="flex">
      <div class="flex flex-col w-80">
        <textarea v-model="pastaStore.text"
          class="w-80 h-[60vh] max-h-[75vh] bg-[#18181b] focus-within:outline-[#a970ff] focus-within:outline-offset-0 focus-within:outline-4 text-[#efeff1] textarea leading-3 rounded" />
        <div class="flex justify-between">
          <div>pasta symbols count:</div>
          <div>{{ pastaStore.text.length }}</div>
        </div>
      </div>
      <div class="flex flex-col justify-between">
        <added-tags />
        <button class="btn btn-primary" @click="(event) => {
          emit('createPastaClick', event);
        }
          ">
          create pasta
        </button>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
const pastaStore = usePastaStore()

const emit = defineEmits<{
  createPastaClick: [event: MouseEvent];
}>();
</script>
