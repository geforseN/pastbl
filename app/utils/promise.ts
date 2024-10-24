import { groupBy } from "./object.ts";

export async function groupAsync<T>(values: MaybePromise<T>[]) {
  const settled = await Promise.allSettled(values);
  const result = groupBy(
    settled,
    (result) => result.status,
    (result) => (result.status === "fulfilled" ? result.value : result.reason),
  ) as {
    fulfilled: Awaited<T>[];
    rejected: unknown[];
  };
  result.rejected ||= [];
  result.fulfilled ||= [];
  return result;
}

export const resolvePromises = groupAsync;

export function sleep<T>(time: number, resolveValue?: T) {
  return new Promise<T>((resolve) => {
    setTimeout(resolve, time, resolveValue);
  });
}
