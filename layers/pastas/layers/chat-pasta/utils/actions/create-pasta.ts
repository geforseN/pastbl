export const createPastaToasts = createActionToasts("create-pasta", {
  success(this: ActionToastsThis) {
    return {
      title: this.i18n.t("toast.createPasta.success.title"),
    };
  },
  failures: {
    badPastaTextLength(this: ActionToastsThis, lengthStatus: BadLengthStatus) {
      return new BadPastaTextLengthError(lengthStatus).toToast(this);
    },
  },
});

function usePastaCreateToasts() {
  return useActionToasts(createPastaToasts);
}

export function usePastaCreate(pastas: UsePastasStateInstance) {
  const __toast__ = usePastaCreateToasts();

  return async function (basePasta: BasePasta) {
    const megaPasta = await makeMegaPasta2(basePasta).catch(__toast__.panic);
    const megaPastaWithId = await pastasService.add(megaPasta);
    pastas.push(megaPastaWithId);
    __toast__.success();
  };
}
