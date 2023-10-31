// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint, @typescript-eslint/no-explicit-any
export function tupleSettledPromises<T, E extends any = unknown>(
  settledValues: PromiseSettledResult<T>[],
): [T[], E[]] {
  return [
    settledValues
      .filter(
        (result): result is PromiseFulfilledResult<T> =>
          result.status === "fulfilled",
      )
      .map((result) => result.value),
    settledValues
      .filter(
        (result): result is PromiseRejectedResult =>
          result.status === "rejected",
      )
      .map((result) => result.reason),
  ];
}
