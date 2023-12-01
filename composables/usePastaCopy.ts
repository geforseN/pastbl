import type { UseClipboardReturn } from "@vueuse/core";

export function usePastaCopy({
  userStore = useUserStore(),
  toast = useToast(),
  clipboard = useClipboard(),
}: {
  userStore?: ReturnType<typeof useUserStore>;
  clipboard?: UseClipboardReturn<false | true>;
  toast?: ReturnType<typeof useToast>;
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
        if (userStore.preferences.alerts.copypastaCopy.mustShowOnSuccess) {
          toast.add({
            description: "Pasta copied successfully",
            title: "Copypasta 🤙🤙🤙",
            timeout: 1_700,
          });
        }
        if (userStore.preferences.sounds.copypastaCopy.mustSoundOnSuccess) {
          // TODO add useSound
        }
        const pastasIdb = await import("~/client-only/IndexedDB/index").then(
          ({ idb }) => idb.pastas,
        );
        await pastasIdb.updatePastaLastCopied(pastaToCopy);
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
  };
}
