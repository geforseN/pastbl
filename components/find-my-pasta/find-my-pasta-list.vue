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
    <div class="container">
      <div class="carousel">
        <chat-pasta v-if="prevPasta" class="prev-pasta" :pasta="prevPasta">
          <template #creatorData>
            <chat-pasta-creator-data
              :badges-count="userStore.user.badges.count"
              :nickname="userStore.user.nickname"
              :nickname-color="userStore.user.preferences.nickname.color"
            />
          </template>
        </chat-pasta>
        <chat-pasta
          v-if="selectedPasta"
          :pasta="selectedPasta"
          class="curr-pasta"
        >
          <template #creatorData>
            <chat-pasta-creator-data
              :badges-count="userStore.user.badges.count"
              :nickname="userStore.user.nickname"
              :nickname-color="userStore.user.preferences.nickname.color"
            />
          </template>
          <template #sidebar>
            <button
              class="btn btn-square btn-md ml-auto rounded-none border-2 border-accent text-xs xs:ml-0"
              :disabled="!clipboard.isSupported.value"
              @click="copyPasta(selectedPasta)"
            >
              copy pasta
            </button>
          </template>
        </chat-pasta>
        <chat-pasta v-if="nextPasta" class="next-pasta" :pasta="nextPasta">
          <template #creatorData>
            <chat-pasta-creator-data
              :badges-count="userStore.user.badges.count"
              :nickname="userStore.user.nickname"
              :nickname-color="userStore.user.preferences.nickname.color"
            />
          </template>
        </chat-pasta>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  pastas: IDBMegaPasta[];
}>();

const selectedPastaNumber = ref(1);
const selectedPastaIndex = computed(() => selectedPastaNumber.value - 1);
const selectedPasta = computed(() => props.pastas[selectedPastaIndex.value]);

const prevPasta = computed(() => {
  if (props.pastas.length === 1) {
    return;
  }
  return props.pastas.at(selectedPastaIndex.value - 1);
});

const nextPasta = computed(() => {
  if (props.pastas.length === 1) {
    return;
  }
  return props.pastas.at((selectedPastaIndex.value + 1) % props.pastas.length);
});

watch(
  () => props.pastas.length,
  () => {
    selectedPastaNumber.value = 1;
  },
);

const userStore = useUserStore();

const clipboard = useClipboard();

const { copyPasta } = usePastaCopy({ userStore, clipboard });
</script>
<style scoped>
.prev-pasta,
.next-pasta {
  --pasta-width: 414px;
  will-change: transform;
  position: absolute;
  top: 0;
  display: none;
}

.prev-pasta {
  transform: rotateY(-55deg) translateZ(-100px);
  right: var(--pasta-width);
}

.next-pasta {
  transform: rotateY(55deg) translateZ(-100px);
  left: var(--pasta-width);
}
</style>
