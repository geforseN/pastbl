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

  const actions = {
    pasta: {
      oncopy: {
        alert() {
          toast.add({
            description: "Pasta copied successfully",
            title: "Copypasta 🤙🤙🤙",
            timeout: 1_700,
          });
        },
        async sound() {
          await new Audio("/sounds/click.wav").play().catch(() => {});
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

  return {
    preferences,
    user,
    clipboard,
    copyPasta: async (pasta: IDBMegaPasta) => {
      try {
        await clipboard.copy(pasta.text);
        assert.ok(toValue(clipboard.copied), new Error("Pasta was not copied"));
        await preferences.pasta.oncopy();
        pastasService.patchLastCopied(pasta);
      } catch (error: Error | unknown) {
        const description = error instanceof Error ? error.message : "";
        toast.add({
          description,
          title: "Pasta copy problem",
          timeout: 7_000,
          color: "red",
        });
      }
    },
  };
});
