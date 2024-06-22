import type { Pasta } from "~~/database/schema";
import { pastasAPI } from "~/resources/pastas";

export function useServerPastas(
  containerRef: MaybeRefOrGetter<Nullish<HTMLElement>>,
) {
  const list = ref<Pasta[]>([]);

  const canLoadMore = ref(true);
  // TODO: use branded cursor type
  const cursor_ = ref<number | null>(null);

  const { isLoading } = useInfiniteScroll(
    containerRef,
    async () => {
      const { pastas, cursor } = await pastasAPI
        .getPastas(cursor_.value)
        .catch((error) => {
          canLoadMore.value = false;
          assert.isError(error);
          console.error(error);
          throw error;
        });
      const megaPastas = pastas.map((pasta) => {
        const megaPasta = createMegaPasta(
          pasta.text,
          pasta.tags.map((tag) => tag.value),
        );
        return {
          ...megaPasta,
          id: pasta.id,
          createdAt: new Date(pasta.publishedAt).valueOf(),
        };
      });
      cursor_.value = cursor;
      list.value.push(...megaPastas);
      if (cursor_.value === null) {
        canLoadMore.value = false;
      }
    },
    { canLoadMore: () => canLoadMore.value },
  );

  return {
    list,
    isLoading,
    async deletePasta(pasta: Pasta) {
      const pastaId = pasta.id;
      await pastasAPI.deletePasta(pastaId);
      list.value = withRemoved(list, (pasta) => pasta.id === pastaId);
    },
  };
}
