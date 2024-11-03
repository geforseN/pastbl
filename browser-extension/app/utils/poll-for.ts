export async function pollFor<T>({
  interval,
  maxAttemptCount,
  queryFn,
  conditionFn = (element) => Boolean(element),
}: {
  maxAttemptCount: number;
  interval: number;
  queryFn: () => T;
  conditionFn?: (element: T) => boolean;
}) {
  let attemptCount = 0;

  return new Promise<T>((resolve, reject) => {
    const intervalId = setInterval(() => {
      attemptCount++;
      const result = queryFn();
      if (conditionFn(result)) {
        consola.success("Element found", { attemptCount });
        clearInterval(intervalId);
        resolve(result);
      } else if (attemptCount >= maxAttemptCount) {
        clearInterval(intervalId);
        reject(new Error("Max attempts reached without finding the element"));
      }
    }, interval);
  });
}
