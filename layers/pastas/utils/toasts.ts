export const getPastaToasts = createActionToasts("get-pasta", {
  failures: {
    noEntityWithId(this: ActionToastsThis, id: number) {
      return new NotFoundPastaError(id).toToast(this);
    },
  },
});
