function isPromiseResultFulfilled<T>(
  result: PromiseSettledResult<Awaited<T>>,
): result is PromiseFulfilledResult<Awaited<T>> {
  return result.status === "fulfilled";
}

function isPromiseResultRejected<T>(
  result: PromiseSettledResult<Awaited<T>>,
): result is PromiseRejectedResult {
  return result.status === "rejected";
}

export async function tupleSettledPromises<T>(
  values: ReadonlyArray<MaybePromise<T>>,
) {
  const settledValues = await Promise.allSettled(values);
  return settledValues.reduce(
    (accumulator, settledPromise) => {
      if (isPromiseResultFulfilled(settledPromise)) {
        accumulator[0].push(settledPromise.value);
      } else if (isPromiseResultRejected(settledPromise)) {
        accumulator[1].push(settledPromise.reason);
      }
      return accumulator;
    },
    [[], []] as [Awaited<T>[], unknown[]],
  );
}
