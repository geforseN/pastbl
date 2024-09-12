<template>
  <div class="flex flex-col items-center gap-2">
    <found-pastas-list-navigation-bar
      v-model:selected-number="selectedPastaNumber"
      :pastas-count="pastas.length"
      @forward="
        () => {
          if (selectedPastaNumber > 1) {
            selectedPastaNumber--;
          } else {
            selectedPastaNumber = pastas.length;
          }
        }
      "
      @back="
        () => {
          if (selectedPastaNumber < pastas.length) {
            selectedPastaNumber++;
          } else {
            selectedPastaNumber = 1;
          }
        }
      "
    />
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
    <span v-else> {{ $t("pasta.notFound") }} </span>
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
  (length) => {
    selectedPastaNumber.value = length > 0 ? 1 : 0;
  },
);

const emoteOnHover = injectEmoteOnHover();

const throttledMouseover = useThrottleFn(
  emoteOnHover.allEmotesHandler,
  100,
  true,
);
</script>
