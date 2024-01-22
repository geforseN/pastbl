<template>
  <div
    v-if="pastasStore.pastas.isLoading"
    class="skeleton flex h-[60dvh] w-[429px] justify-center rounded-none p-2 go-brr:h-[80dvh]"
  >
    Loading pastas
  </div>
  <div
    v-if="pastasStore.pastas.isReady && !pastasStore.pastas.state.length"
    class="mt-4 flex justify-center font-bold"
  >
    No pastas were added yet!
  </div>
  <client-only>
    <div
      v-if="!userStore.clipboard.isSupported"
      class="alert alert-warning flex justify-center"
    >
      <span>
        Your browser does not support Clipboard API!. Copy of pasta by clicking
        on the button will fail
      </span>
    </div>
  </client-only>
  <div
    class="flex max-h-[60dvh] flex-col gap-y-2 overflow-y-auto go-brr:max-h-[77dvh]"
  >
    <chat-pasta
      v-for="pasta of pastasStore.pastasSortedByNewest"
      :key="pasta.id"
      :pasta="pasta"
      @populate="
        (pastaTextContainer) =>
          populatePasta(pastaTextContainer, pasta, emotesStore)
      "
    >
      <template #creatorData><slot name="creatorData" /></template>
      <template #sidebar>
        <div
          class="flex flex-row-reverse justify-between gap-x-2 gap-y-0.5 xs:flex-col xs:justify-between xs:gap-x-0"
        >
          <button
            class="btn btn-square btn-accent btn-md border-2 border-accent-content text-xs"
            :disabled="!userStore.clipboard.isSupported"
            @click="userStore.copyPasta(pasta)"
          >
            Copy pasta
          </button>
          <div class="dropdown dropdown-top dropdown-hover xs:dropdown-end">
            <div
              tabindex="0"
              role="button"
              class="btn btn-square btn-primary border-2 border-primary-content xs:btn-xs xs:w-full"
            >
              <icon
                class="xs:-translate-y-[1px]"
                name="ic:baseline-more-horiz"
              />
            </div>
            <ul
              tabindex="0"
              class="menu dropdown-content z-[1] flex w-min flex-col gap-1 rounded-btn border border-base-content bg-base-100 p-2 shadow"
            >
              <li>
                <button
                  class="btn btn-accent"
                  :disabled="!userStore.clipboard.isSupported"
                  @click="userStore.copyPasta(pasta)"
                >
                  Copy pasta
                  <icon name="ic:baseline-content-copy" />
                </button>
              </li>
              <li>
                <nuxt-link
                  :to="`/pastas/edit/${pasta.id}`"
                  class="btn btn-info w-full"
                >
                  Change pasta
                  <icon name="ic:outline-edit" />
                </nuxt-link>
              </li>
              <li>
                <button
                  class="btn btn-error w-full"
                  @click="pastasStore.removePasta(pasta)"
                >
                  Delete pasta
                  <icon name="ic:baseline-delete-outline" />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </template>
    </chat-pasta>
  </div>
</template>
<script setup lang="ts">
defineSlots<{
  creatorData?: () => unknown;
}>();

const pastasStore = usePastasStore();
const userStore = useUserStore();

const emotesStore = useEmotesStore();
</script>
