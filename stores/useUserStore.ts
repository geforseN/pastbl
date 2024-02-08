import { defineStore } from "pinia";
import { pastasService } from "~/client-only/services";

export const useUserStore = defineStore("user", () => {
  const nicknameColor = useIndexedDBKeyValue("nickname:color", "#000000");
  const nicknameText = useIndexedDBKeyValue("nickname:value", "Kappa", {
    debounce: 1_000,
  });
  const badgesCount = useIndexedDBKeyValue("badges:count", 1);
  const pastaOncopy = useIndexedDBKeyValue("pasta:oncopy", "alert");

  const debouncedNicknameColor = refDebounced(nicknameColor.state, 300);

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
      async oncopy() {
        if (pastaOncopy.state.value === "none") {
          return;
        }
        for (const action of pastaOncopy.state.value.split("&")) {
          // @ts-ignore
          await actions.pasta.oncopy[action]();
        }
      },
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
    },
    async copyText(text: string) {
      const m = "toast.copyPasta.fail.";
      try {
        await clipboard.copy(text);
        assert.ok(toValue(clipboard.copied), t(m + "clipboardMessage"));
        await preferences.pasta.oncopy();
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
