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
              selectedPastaNumber = pastas.length;
            }
          }
        "
      >
        &lt;&lt;
      </button>
      <input
        id="current-pasta-number"
        :value="`${selectedPastaNumber} / ${pastas.length}`"
        class="input join-item input-secondary"
        readonly
        name="current-pasta-number"
      />
      <button
        class="btn btn-secondary join-item"
        @click="
          () => {
            if (selectedPastaNumber < pastas.length) {
              selectedPastaNumber++;
            } else {
              selectedPastaNumber = 1;
            }
          }
        "
      >
        &gt;&gt;
      </button>
    </div>
    <!-- NOTE: chat-pasta :key is important, without it component populate emit will be called once -->
    <chat-pasta
      v-if="selectedPasta"
      :key="selectedPasta.id"
      v-bind="selectedPasta"
      @copy="pastasStore.copyPasta(selectedPasta)"
      @delete="pastasStore.removePasta(selectedPasta)"
      @mouseover="throttledMouseover"
      @populate="
        (pastaTextContainer) =>
          populatePasta(
            pastaTextContainer,
            selectedPasta.validTokens,
            emotesStore.findEmote,
          )
      "
    >
      <template #creatorData>
        <chat-pasta-creator-data
          :badges-count="userStore.user.badges.count.state"
          :nickname="userStore.user.nickname_"
          :nickname-color="userStore.user.nickname.color.state"
        />
      </template>
    </chat-pasta>
  </div>
</template>
<script lang="ts" setup>
const userStore = useUserStore();
const emotesStore = useEmotesStore();
const pastasStore = usePastasStore();
const pastaFindStore = usePastaFindStore();

const pastas = computed(() => pastaFindStore.showedPastas);

const selectedPastaNumber = ref(1);
const selectedPastaIndex = computed(() => selectedPastaNumber.value - 1);

const selectedPasta = computed(() => pastas.value[selectedPastaIndex.value]);

watch(
  () => pastas.value.length,
  () => {
    selectedPastaNumber.value = 1;
  },
);

const emoteOnHover = injectEmoteOnHover();

const throttledMouseover = useThrottleFn(
  emoteOnHover.allEmotesHandler,
  100,
  true,
);
</script>
