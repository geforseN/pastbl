import { useInfiniteScroll, type UseInfiniteScrollOptions } from "@vueuse/core";

export function useInfiniteRemotePastas<T extends HTMLElement | null>(
  container: MaybeRefOrGetter<T>,
  cursor: MaybeRefOrGetter<Nullish<number>>,
  onLoaded: (response: GetPastasResponse) => void,
  getRemotePastas: GetPastasFn,
  options?: UseInfiniteScrollOptions<T>,
) {
  let canLoadMore = true;

  const canLoadMore_ = options?.canLoadMore;

  const { isLoading, reset } = useInfiniteScroll(
    container,
    async () => {
      try {
        let cursorValue = toValue(cursor);
        if (cursorValue === undefined) {
          cursorValue = null;
        }
        const response = await getRemotePastas(cursorValue);
        if (response.cursor === null) {
          canLoadMore = false;
        }
        onLoaded(response);
      } catch (error) {
        canLoadMore = false;
        consola.withTag("infinite-remote-pastas").error(error);
        if (!(error instanceof Error)) {
          throw error;
        }
        throw error;
      }
    },
    {
      ...options,
      canLoadMore: typeof canLoadMore_ === "function"
        ? () => canLoadMore_(toValue(container)) && canLoadMore
        : () => canLoadMore,
    },
  );

  return {
    isLoading,
    reset,
  };
}
