import { computed } from "vue";
import type { Ref } from "vue";
import type { OmegaPasta } from "../utils/pasta";

export function usePastasTextLength(pastas: Ref<OmegaPasta[]>) {
  const pastasTextLength = computed(() =>
    pastas.value.map((pasta) => pasta.text.length),
  );

  return {
    min: computed(() =>
      pastasTextLength.value.length > 0
        ? Math.min(...pastasTextLength.value)
        : 0,
    ),
    max: computed(() =>
      pastasTextLength.value.length > 0
        ? Math.max(...pastasTextLength.value)
        : 0,
    ),
  };
}
