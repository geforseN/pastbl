export function usePastasTags(pastas: Ref<OmegaPasta[]>) {
  const allTags = computed(() => pastas.value.flatMap((pasta) => pasta.tags));

  return {
    sortedEntriesByPopularity: computed(() => {
      const tags = allTags.value;
      const appearancesMap = countAppearances(tags);
      return [...appearancesMap].sort(
        ([, aCount], [, bCount]) => bCount - aCount,
      );
    }),
  };
}
