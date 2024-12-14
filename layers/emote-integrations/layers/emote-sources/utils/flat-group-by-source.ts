import type { EmoteSource } from "./external";
import { flatGroupBy } from "~/utils/object.ts";

export function flatGroupBySource<T extends { source: EmoteSource }, V = T>(
  items: T[],
  getValue?: (value: T, index: number, array: T[]) => V,
) {
  return flatGroupBy<T, EmoteSource, V>(items, (item) => item.source, getValue);
}
