export const copyTextToasts = createActionToasts("copy-text", {
  success(this: ActionToastsThis) {
    return {
      timeout: 1700,
      title: this.i18n.t("toast.copyText.success"),
    };
  },
  failures: {
    default(this: ActionToastsThis) {
      return {
        description: this.i18n.t("toast.copyText.fail.genericMessage"),
        timeout: 7000,
      };
    },
    clipboardApiError(this: ActionToastsThis) {
      return {
        description: this.i18n.t("toast.copyText.fail.clipboardMessage"),
      };
    },
  },
});

export function useCopyTextToasts() {
  return useActionToasts(copyTextToasts);
}

export type UseTextCopyOptions = {
  onFail?: () => MaybePromise<void>;
  onSuccess?: () => MaybePromise<void>;
};

export function useTextCopy(initialOptions: UseTextCopyOptions = {}) {
  const clipboard = useClipboard();

  return async function copyText(
    text: string,
    options: UseTextCopyOptions = {},
  ) {
    await clipboard.copy(text);
    if (clipboard.copied.value) {
      await initialOptions.onSuccess?.();
      await options.onSuccess?.();
    }
    else {
      await initialOptions.onFail?.();
      await options.onFail?.();
    }
  };
}
