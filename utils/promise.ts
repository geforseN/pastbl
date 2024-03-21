import { groupBy } from "./object";

export async function groupAsync<T>(values: MaybePromise<T>[]) {
  const settled = await Promise.allSettled(values);
  return groupBy(
    settled,
    (result) => result.status,
    // @ts-expect-error result is object, which either has value or reason property (depending on status property)
    (result) => result.value || result.reason,
  ) as {
    fulfilled: Awaited<T>[];
    rejected: unknown[];
  };
}

export function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
