export function useCopyText(
  options: {
    onFail?: () => MaybePromise<void>;
    onSuccess?: () => MaybePromise<void>;
  } = {},
) {
  const clipboard = useClipboard();

  return async function copyText(text: string) {
    await clipboard.copy(text);
    if (clipboard.copied.value) {
      await options.onSuccess?.();
    } else {
      await options.onFail?.();
    }
  };
}
