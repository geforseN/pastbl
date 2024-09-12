export const copyPastaToasts = createActionToasts("copy-pasta", {
  success(this: ActionToastsThis) {
    return {
      timeout: 1700,
      title: this.i18n.t("toast.copyPasta.success"),
    };
  },
});

export function useCopyPastaToasts() {
  return useActionToasts(copyPastaToasts);
}

export function usePastaCopy(pastas: UsePastasStateInstance) {
  const __toast__ = useCopyPastaToasts();
  const userStore = useUserStore();

  return async function (pasta: OmegaPasta) {
    await userStore.copyText(pasta.text, {
      async onSuccess() {
        userStore.userPreferences.onPastaTextCopy();
        const index = await pastas
          .getIndexById(pasta.id)
          .catch(__toast__.panic);
        const newPasta = await pastasService.patchLastCopied(toRaw(pasta));
        pastas.mutateAt(index, newPasta);
      },
    });
  };
}
