export async function loadCollection(
  getCollection: () => Promise<void>,
  options: {
    beforeLoad?: () => MaybePromise<void>;
    onEnd?: () => MaybePromise<void>;
    onError?: (error: unknown) => MaybePromise<void>;
  } = {},
) {
  try {
    const collectionPromise = getCollection();
    await options.beforeLoad?.();
    await collectionPromise;
  } catch (error) {
    await options.onError?.(error);
  } finally {
    await options.onEnd?.();
  }
}
