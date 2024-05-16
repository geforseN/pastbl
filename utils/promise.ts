import { groupBy } from "./object";

export async function groupAsync<T>(values: MaybePromise<T>[]) {
  const settled = await Promise.allSettled(values);
  return groupBy(
    settled,
    (result) => result.status,
    (result) => (result.status === "fulfilled" ? result.value : result.reason),
  ) as {
    fulfilled: Awaited<T>[];
    rejected: unknown[];
  };
}

export function sleep<T>(time: number, resolveValue?: T) {
  return new Promise<T>((resolve) => {
    setTimeout(resolve, time, resolveValue);
  });
}
