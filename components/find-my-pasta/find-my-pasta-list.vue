<template>
  <div class="flex flex-col items-center gap-2">
    <div class="join">
      <button
        class="btn btn-secondary join-item"
        @click="
          () => {
            if (selectedPastaNumber > 1) {
              selectedPastaNumber--;
            } else {
              selectedPastaNumber = props.pastas.length;
            }
          }
        "
      >
        &lt&lt
      </button>
      <input
        id="current-pasta-number"
        :value="`${selectedPastaNumber} / ${props.pastas.length}`"
        class="input join-item input-secondary"
        readonly
        name="current-pasta-number"
      />
      <button
        class="btn btn-secondary join-item"
        @click="
          () => {
            if (selectedPastaNumber < props.pastas.length) {
              selectedPastaNumber++;
            } else {
              selectedPastaNumber = 1;
            }
          }
        "
      >
        &gt&gt
      </button>
    </div>
    <!-- NOTE: chat-pasta :key is important, without it component populate emit will be called once -->
    <chat-pasta
      v-if="selectedPasta"
      :key="selectedPasta.id"
      :pasta="selectedPasta"
      @populate="
        (pastaTextContainer, selectedPasta) =>
          populatePasta(pastaTextContainer, selectedPasta, emotesStore)
      "
    >
      <template #creatorData>
        <chat-pasta-creator-data
          :badges-count="userStore.user.badges.count.state"
          :nickname="userStore.user.nickname.text.state"
          :nickname-color="userStore.user.nickname.color.state"
        />
      </template>
      <template #sidebar>
        <button
          class="btn btn-square btn-md ml-auto rounded-none border-2 border-accent text-xs xs:ml-0"
          :disabled="!userStore.clipboard.isSupported"
          @click="userStore.copyPasta(selectedPasta)"
        >
          copy pasta
        </button>
      </template>
    </chat-pasta>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  pastas: IDBMegaPasta[];
}>();

const selectedPastaNumber = ref(1);
const selectedPastaIndex = computed(() => selectedPastaNumber.value - 1);
const selectedPasta = computed(() => props.pastas[selectedPastaIndex.value]);

const userStore = useUserStore();
const emotesStore = useEmotesStore();
</script>
