type StringWithoutAmpersand<S extends string> = S extends `${infer T}${infer U}`
  ? T extends "&"
    ? never
    : U extends "&"
      ? never
      : string
  : never;

async function handlePreferences<
  K extends string,
  PK extends StringWithoutAmpersand<K>,
>(
  handlers: Record<Exclude<PK, "none">, () => MaybePromise<void>>,
  preferenceRef: Ref<K>,
) {
  const preference = preferenceRef.value;
  if (preference === "none") {
    return;
  }
  for (const action of preference.split("&")) {
    await handlers[action as Exclude<PK, "none">]();
  }
}

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
  const toast = useNuxtToast();
  const { t } = useI18n();

  const actions = {
    pasta: {
      oncopy: {
        alert() {
          toast.add({
            description: t("toast.copyPasta.success.message"),
            title: t("toast.copyPasta.success.title"),
            timeout: 1_700,
          });
        },
        async sound() {
          await new Audio("/sounds/click.wav").play();
        },
      },
    },
  };

  const preferences = {
    pasta: {
      oncopy: () => handlePreferences(actions.pasta.oncopy, pastaOncopy.state),
    },
  };

  const pastasStore = usePastasStore();

  return {
    preferences,
    user,
    clipboard,
    async copyPasta(pasta: IDBMegaPasta) {
      await this.copyText(pasta.text);
      await pastasStore.patchPatchLastCopied(pasta);
      await preferences.pasta.oncopy();
    },
    async copyText(text: string) {
      const m = "toast.copyText.fail.";
      try {
        await clipboard.copy(text);
        assert.ok(toValue(clipboard.copied), t(m + "clipboardMessage"));
      } catch (reason: Error | unknown) {
        const description =
          reason instanceof Error ? reason.message : t(m + "genericMessage");
        toast.add({
          description,
          timeout: 7_000,
          color: "red",
        });
      }
    },
  };
});
