export function usePastas<T extends IDBMegaPasta>(
  getPastas: () => Promise<T[]>,
) {
  const pastas = useMyAsyncState(getPastas, []);

  return {
    ...pastas,
    getIndexById(id: number) {
      return getIndex(
        pastas.state,
        (pasta_) => pasta_.id === id,
        createNoLocaleFailureNotification("getPasta__noEntityWithId", id),
      );
    },
    getEntryById(id: number) {
      const index = this.getIndexById(id);
      const pasta = pastas.state.value[index];
      return [index, pasta] as const;
    },
    getById(id: number) {
      const index = this.getIndexById(id);
      const pasta = pastas.state.value[index];
      return pasta;
    },
    removeAt(index: number) {
      pastas.state.value = pastas.state.value.toSpliced(index, 1);
    },
    push(pasta: T) {
      pastas.state.value = [...pastas.state.value, pasta];
    },
    pushAt(index: number, pasta: T) {
      pastas.state.value = pastas.state.value.toSpliced(index, 0, pasta);
    },
    mutateAt(index: number, pasta: T) {
      pastas.state.value = pastas.state.value.with(index, pasta);
    },
  };
}
