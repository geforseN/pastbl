export const useUserStore = defineStore("user", () => {
  const nicknameColor = useIndexedDBKeyValue("nickname:color", "#000000");
  const nicknameText = useIndexedDBKeyValue("nickname:value", "Kappa", {
    debounce: 1_000,
  });
  const badgesCount = useIndexedDBKeyValue("badges:count", 1);
  const pastaOncopy = useIndexedDBKeyValue("pasta:oncopy", "alert");

  const debouncedNicknameColor = refDebounced(nicknameColor.state, 200);

  const user = {
    nickname: {
      color: nicknameColor,
      text: nicknameText,
    },
    badges: {
      count: badgesCount,
    },
    pasta: {
      oncopy: pastaOncopy,
    },
    debounced: {
      nickname: {
        color: debouncedNicknameColor,
      },
    },
  };

  const clipboard = useClipboard();
  const toast = useMyToast();
  const { t } = useI18n();
  const userSession = useUserSession();
  const isOnline = useOnline();
  const pastasWorkMode = usePastasWorkMode("server", userSession, isOnline);

  const actions = {
    pasta: {
      onTextCopy: {
        alert() {
          toast.notify("success", "pastaCopied");
        },
        async sound() {
          await new Audio("/sounds/click.wav").play();
        },
      },
    },
  };

  const preferences = {
    pasta: {
      oncopy: () =>
        handlePreferences(actions.pasta.onTextCopy, pastaOncopy.state),
    },
  };

  const pastasStore = usePastasStore();

  return {
    pastasWorkMode,
    formCollapse: useFormCollapse(),
    preferences,
    user,
    async copyPasta(pasta: IDBMegaPasta) {
      await this.copyText(pasta.text, {
        async onSuccess() {
          preferences.pasta.oncopy();
          await pastasStore.patchPastaLastCopied(pasta);
        },
      });
    },
    async copyText(text: string, options: { onSuccess?: () => Promise<void> }) {
      try {
        await clipboard.copy(text);
        assert.ok(
          toValue(clipboard.copied),
          t("toast.copyText.fail.clipboardMessage"),
        );
        await options.onSuccess?.();
        preferences.pasta.oncopy();
      } catch (reason: Error | unknown) {
        throw toast.fail("copyText__genericFail");
      }
    },
  };
});
