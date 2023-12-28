import type { UseClipboardReturn } from "@vueuse/core";

export function usePastaCopy({
  userStore = useUserStore(),
  toast = useNuxtToast(),
  clipboard = useClipboard(),
}: {
  userStore?: ReturnType<typeof useUserStore>;
  clipboard?: UseClipboardReturn<false | true>;
  toast?: ReturnType<typeof useNuxtToast>;
} = {}) {
  if (!clipboard.isSupported) {
    toast.add({
      description:
        "Your browser does not support Clipboard API. Please use another browser.",
      title: "Pasta copy problem",
      timeout: 10_000,
      color: "red",
    });
  }

  return {
    copyPasta: async (pastaToCopy: IDBMegaPasta) => {
      try {
        await clipboard.copy(pastaToCopy.text);
        if (!clipboard.copied) {
          throw new Error("Pasta was not copied");
        }
        if (userStore.preferences.pasta.oncopy.includes("alert")) {
          toast.add({
            description: "Pasta copied successfully",
            title: "Copypasta 🤙🤙🤙",
            timeout: 1_700,
          });
        }
        if (userStore.preferences.pasta.oncopy.includes("sound")) {
          await new Audio("/sounds/click.wav").play().catch(() => {});
        }
        const pastasIdb = await import("~/client-only/IndexedDB").then(
          ({ idb }) => idb.pastas,
        );
        await pastasIdb.list.updatePastaLastCopied(pastaToCopy);
      } catch (error: Error | unknown) {
        toast.add({
          description:
            error instanceof Error
              ? error.message
              : "Something went wrong on pasta copy",
          title: "Pasta copy problem",
          timeout: 7_000,
          color: "red",
        });
      }
    },
    isSupported: clipboard.isSupported,
  };
}
