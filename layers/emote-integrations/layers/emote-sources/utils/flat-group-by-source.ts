import { flatGroupBy } from "~/utils/object";

export function flatGroupBySource<T extends { source: EmoteSource }, V>(
  items: T[],
  getValue?: (value: T, index: number, array: T[]) => V,
) {
  return flatGroupBy<T, EmoteSource, V>(items, (item) => item.source, getValue);
}
