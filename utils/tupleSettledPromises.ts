export default <T, E extends unknown>(
  settledValues: PromiseSettledResult<T>[],
): [T[], E[]] => {
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
};
