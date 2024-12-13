import { ref } from "vue";
import { usePastasSort } from "../../layers/pastas/layers/chat-pasta/composables/usePastasSort";
import { usePastaPut } from "../../layers/pastas/layers/chat-pasta/utils/actions/put-pasta";
import { usePastaCopy } from "../../layers/pastas/layers/chat-pasta/utils/actions/copy-pasta";
import { usePastaRemove } from "../../layers/pastas/layers/chat-pasta/utils/actions/remove-pasta";
import { usePastaCreate } from "../../layers/pastas/layers/chat-pasta/utils/actions/create-pasta";
import { pastasService } from "../../layers/pastas/utils/service/singleton";
import { usePastas } from "../../layers/pastas/layers/chat-pasta/composables/usePastas";
import { usePersonsEmoteCollectionsStore } from "./usePersonsEmoteCollectionsStore";

export const usePastasStore = defineStore("pastas", () => {
  const personsEmoteCollections = usePersonsEmoteCollectionsStore();

  const pastas = usePastas(async () => await pastasService.getAll());
  const __remotePastas = ref<{
    id: number;
    text: string;
    publishedAt: string;
    tags: string[];
  }[]>([]);

  const createPasta = usePastaCreate(pastas);
  const removePasta = usePastaRemove(pastas);
  const copyPasta = usePastaCopy(pastas);
  const putPasta = usePastaPut(pastas);

  const { selectedSortStrategy, sortedPastas } = usePastasSort(pastas.state);
  const {
    selectedShowStrategy,
    pastasToShow,
    usersPastasMap,
    isNoPastasToShow,
    isPersonTagShowStrategySelected,
  } = usePastasShow(
    sortedPastas,
    computed(() => personsEmoteCollections.selectedLogin.state),
  );
  const pastasTextLength = usePastasTextLength(pastas.state);
  const pastasTags = usePastasTags(pastas.state);

  const canShowPastas = computedAsync(async () => {
    await Promise.all([
      until(() => useEmotesStore().canUseUserEmotes).toBe(true),
      until(pastas.isReady).toBe(true, { timeout: 3500 }),
    ]).catch(() => {});
    return true;
  }, false);

  return {
    __remotePastas,
    canShowPastas,
    async cancelPastasShowForOneTick() {
      const pastValue = canShowPastas.value;
      canShowPastas.value = false;
      await nextTick();
      canShowPastas.value = pastValue;
    },
    pastasTextLength,
    pastasToShow,
    usersPastasMap,
    isNoPastasToShow,
    isPersonTagShowStrategySelected,
    selectedShowStrategy,
    selectedSortStrategy,
    pastas,
    sortedPastas,
    pastasTags,
    createPasta,
    removePasta,
    copyPasta,
    putPasta,
  };
});
