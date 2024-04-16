export type PastaSortStrategy =
  | "newest-first"
  | "oldest-first"
  | "last-updated"
  | "last-copied";

export function usePastasSort(allPastas: Ref<IDBMegaPasta[]>) {
  const selectedSortStrategy = useIndexedDBKeyValue(
    "pasta-list:sort-strategy",
    "newest-first",
  );
  const sortedPastas = {
    "newest-first": computed(() =>
      allPastas.value.toSorted((a, b) => b.createdAt - a.createdAt),
    ),
    "oldest-first": computed(() =>
      allPastas.value.toSorted((a, b) => a.createdAt - b.createdAt),
    ),
    "last-updated": computed(() =>
      allPastas.value.toSorted(
        (a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt),
      ),
    ),
    "last-copied": computed(() =>
      allPastas.value.toSorted((a, b) => {
        if (a.lastCopiedAt && b.lastCopiedAt) {
          return b.lastCopiedAt - a.lastCopiedAt;
        }
        const isOnlyOneHasLastCopied = !a.lastCopiedAt !== !b.lastCopiedAt;
        if (isOnlyOneHasLastCopied) {
          return a.lastCopiedAt ? -1 : 1;
        }
        return (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt);
      }),
    ),
  } satisfies Record<PastaSortStrategy, ComputedRef<IDBMegaPasta[]>>;

  return {
    selectedSortStrategy: computed({
      get() {
        return selectedSortStrategy.state.value;
      },
      set(value) {
        selectedSortStrategy.state.value = value;
      },
    }),
    sortedPastas: computed(
      () => sortedPastas[selectedSortStrategy.state.value].value,
    ),
  };
}
