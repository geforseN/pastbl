export function usePastaCopy({
  userStore = useUserStore(),
  pastasStore = usePastasStore(),
  toast = useToast(),
  // @ts-expect-error do not know how to fix, not critical
  clipboard = useClipboard(),
}: {
  userStore?: ReturnType<typeof useUserStore>;
  pastasStore?: ReturnType<typeof usePastasStore>;
  clipboard?: ReturnType<typeof useClipboard>;
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

  async function handlePastaCopy(pastaToCopy: IDBMegaPasta) {
    try {
      await clipboard.copy(pastaToCopy.text);
      if (!clipboard.copied) {
        throw new Error("Pasta was not copied");
      }
      const storePasta = pastasStore.pastas.find(
        (pasta) => pasta.id === pastaToCopy.id,
      );
      assert.ok(storePasta);
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
      const { pastasIdb } = await import("~/client-only/IndexedDB/pastas");
      pastasIdb.idb.put("list", {
        ...storePasta,
        tags: toRaw(storePasta.tags),
        validTokens: toRaw(storePasta.validTokens),
        lastCopiedAt: Date.now(),
      });
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
  }

  return {
    handlePastaCopy,
  };
}
