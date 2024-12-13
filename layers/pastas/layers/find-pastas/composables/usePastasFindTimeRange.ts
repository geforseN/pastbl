import { watchOnce } from "@vueuse/core";
import { toDateCompactISO } from "../../../../../app/utils/time";
import type { OmegaPasta } from "../../chat-pasta/utils/pasta";

export function usePastaFindTimeRange<
  PK extends keyof Pick<OmegaPasta, "createdAt" | "lastCopiedAt" | "updatedAt">,
>(
  pastaTimePropertyKey: PK,
  pastas: Ref<OmegaPasta[]>,
  ascendingPastas = computed(() =>
    pastas.value
      .filter((pasta) => pasta[pastaTimePropertyKey] !== undefined)
      .toSorted((a, b) => a[pastaTimePropertyKey]! - b[pastaTimePropertyKey]!),
  ),
) {
  const ascendingTimes = computed(() =>
    ascendingPastas.value.map((pasta) => pasta[pastaTimePropertyKey]),
  );
  const from = ref<ReturnType<Date["toISOString"]>>();
  const to = ref<ReturnType<Date["toISOString"]>>();

  const min = computed(() => ascendingTimes.value[0] || 0);
  const max = computed(() => ascendingTimes.value.at(-1) || 0);

  watchOnce([min, max], ([min, max]) => {
    from.value = toDateCompactISO(min);
    to.value = toDateCompactISO(max);
  });

  const appropriatePastas = computed(() => {
    if (from.value === undefined || to.value === undefined) {
      return ascendingPastas.value;
    }
    const minIndex = ascendingPastas.value.findIndex(
      (pasta) =>
        pasta[pastaTimePropertyKey]! >= new Date(from.value!).valueOf(),
    );
    const maximalIndex = ascendingPastas.value.findLastIndex(
      (pasta) => pasta[pastaTimePropertyKey]! <= new Date(to.value!).valueOf(),
    );
    const maxIndex = Math.max(minIndex, maximalIndex);
    return ascendingPastas.value.slice(minIndex, maxIndex + 1);
  });

  return {
    appropriatePastas,
    from,
    to,
    max: computed(() => toDateCompactISO(ascendingTimes.value.at(-1) || 0)),
    min: computed(() => toDateCompactISO(ascendingTimes.value[0] || 0)),
  };
}
