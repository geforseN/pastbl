import type { Pasta } from "~~/database/schema";
import {
  type RemotePastasPaginationCursor,
  assertIsRemotePastasPaginationCursor,
} from "~/brands";

export function useRemotePastas(
  containerRef: MaybeRefOrGetter<Nullish<HTMLElement>>,
) {
  const list = ref<Pasta[]>([]);

  const canLoadMore = ref(true);
  const cursor_ = ref<RemotePastasPaginationCursor>(null);
  const pagination = { cursor_ };

  const { isLoading } = useInfiniteScroll(
    containerRef,
    async () => {
      const { pastas, cursor } = await pastasAPI
        .getPastas(pagination.cursor_.value)
        .catch((error) => {
          canLoadMore.value = false;
          assert.isError(error);
          log("error", "Failed to load remove pastas", { error });
          throw error;
        });
      assertIsRemotePastasPaginationCursor(cursor);
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
      list.value.push(...megaPastas);
      if (cursor === null) {
        canLoadMore.value = false;
      }
      pagination.cursor_.value = cursor;
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
