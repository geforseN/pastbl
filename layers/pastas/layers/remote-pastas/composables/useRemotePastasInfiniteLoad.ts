import { useInfiniteScroll } from "@vueuse/core";
import type { MaybeRefOrGetter } from "vue";
import { assert } from "../../../../../app/utils/assert";
import { log } from "../../../../../shared/utils/dev-only";
import type { MaybePromise, Nullish } from "../../../../../app/utils/types";

export function useRemotePastasInfiniteLoad<C>(
  container: MaybeRefOrGetter<Nullish<HTMLElement>>,
  onLoadMore: (cursor: Nullish<C>) => MaybePromise<{ cursor: Nullish<C> }>,
) {
  let canLoadMore = true;
  let cursor: Nullish<C> = null;
  return useInfiniteScroll(
    container,
    async () => {
      try {
        const response = await onLoadMore(cursor);
        cursor = response.cursor ?? null;
        if (cursor === null) {
          canLoadMore = false;
        }
      } catch (cause) {
        canLoadMore = false;
        log("error", "Failed to load", { cause });
        assert.isError(cause);
        throw cause;
      }
    },
    { canLoadMore: () => canLoadMore },
  );
}
