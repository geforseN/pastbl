export async function tupleSettledPromises<T>(
  values: ReadonlyArray<MaybePromise<T>>,
): Promise<[Awaited<T>[], unknown[]]> {
  const settledValues = await Promise.allSettled(values);
  const fulfilled = settledValues
    .filter(
      (result): result is PromiseFulfilledResult<Awaited<T>> =>
        result.status === "fulfilled",
    )
    .map((result) => result.value);
  const rejected = settledValues
    .filter(
      (result): result is PromiseRejectedResult => result.status === "rejected",
    )
    .map((result) => result.reason);
  return [fulfilled, rejected];
}
