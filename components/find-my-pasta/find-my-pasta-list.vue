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
        (pastaTextContainer) =>
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
        <chat-pasta-sidebar
          dropdown-class="dropdown dropdown-top dropdown-hover xs:dropdown-end go-brr:dropdown-bottom"
          :pasta-id="selectedPasta.id"
          :is-clipboard-supported="userStore.clipboard.isSupported"
          @copy="userStore.copyPasta(selectedPasta)"
          @delete="pastasStore.removePasta(selectedPasta)"
        />
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
const pastasStore = usePastasStore();
</script>
