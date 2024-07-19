import { flatGroupBy } from "~/utils/object";

export function flatGroupBySource<T extends { source: EmoteSource }>(
  items: T[],
) {
  return flatGroupBy(items, (item) => item.source);
}
