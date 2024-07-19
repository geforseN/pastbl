type UseCopyTextOptions = {
  onFail?: () => MaybePromise<void>;
  onSuccess?: () => MaybePromise<void>;
};

export function useCopyText(initialOptions: UseCopyTextOptions = {}) {
  const clipboard = useClipboard();

  return async function copyText(
    text: string,
    options: UseCopyTextOptions = {},
  ) {
    await clipboard.copy(text);
    if (clipboard.copied.value) {
      await initialOptions.onSuccess?.();
      await options.onSuccess?.();
    } else {
      await initialOptions.onFail?.();
      await options.onFail?.();
    }
  };
}
