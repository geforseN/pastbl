<template>
  <div v-if="!pastasStore.isLoaded_" class="bg-red-900">LOADING</div>
  <template v-else>
    <div v-if="pastasStore.pastas.length === 0" class="justify-self-center mt-4">
      No pastas were added yet!
    </div>
    <div v-else class="">
      <div v-if="!clipboard.isSupported">Your browser does not support Clipboard API</div>
      <chat-pasta v-for="pasta of pastasStore.pastas" :pasta="pasta" @pasta-remove="pastasStore.removePasta(pasta)" >
        <template #user-nickname>
          <slot />
        </template>
        <template #copypasta-btn>
          <button :disabled="!clipboard.isSupported.value" class="btn btn-md btn-square rounded-none border-accent border-2 text-xs"
            @click="handleCopypastaCopy(pasta)">
            copy pasta
          </button>
        </template>
      </chat-pasta>
    </div>
  </template>
</template>

<script setup lang="ts">
// TODO add useSound composable
// TODO add user.preference.shouldShowToastOnCopypastaSuccess

const pastasStore = usePastasStore()

const toast = useToast()
const clipboard = useClipboard({})
if (!clipboard.isSupported) {
  toast.add({ description: 'Your browser does not support Clipboard API', title: 'Copypasta problem', timeout: 10_000, color: 'red' })
}

async function handleCopypastaCopy(pasta: Pasta) {
  try {
    await clipboard.copy(pasta.text);
    if (!clipboard.copied) {
      throw new Error('Copypasta was not copied')
    }
    toast.add({ description: 'Copypasta copied successfully', title: 'Copypasta 🤙🤙🤙', timeout: 1_700 })
  } catch (error: Error | unknown) {
    const description =
      typeof error === 'object'
      && error !== null
      && 'message' in error
      && error.message
    toast.add({
      description: description || 'Copypasta was not copied',
      title: 'Copypasta problem',
      timeout: 7_000,
      color: 'red'
    })
  }
}

</script>
