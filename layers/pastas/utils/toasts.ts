export const getPastaToasts = createActionToasts("get-pasta", {
  failures: {
    noEntityWithId(id: number) {
      return new NotFoundPastaError(id).toToast(this);
    },
  },
});
