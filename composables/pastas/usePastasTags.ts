export function usePastasTags(pastas: Ref<IDBMegaPasta[]>) {
  const allTags = computed(() => pastas.value.flatMap((pasta) => pasta.tags));

  return {
    sortedEntriesByPopularity: computed(() => {
      const tags = allTags.value;
      const appearancesMap = countAppearances(tags);
      return Array.from(appearancesMap).sort(
        ([, aCount], [, bCount]) => bCount - aCount,
      );
    }),
  };
}
