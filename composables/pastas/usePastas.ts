export function usePastas<T extends OmegaPasta>(getPastas: () => Promise<T[]>) {
  const _pastas = useMyAsyncState(getPastas, []);

  return {
    ..._pastas,
    // eslint-disable-next-line require-await
    async getIndexById(id: number) {
      return getIndex(
        _pastas.state,
        (pasta_) => pasta_.id === id,
        createNoLocaleFailureNotification("getPasta__noEntityWithId", id),
      );
    },
    async getEntryById(id: number) {
      const index = await this.getIndexById(id);
      const pasta = _pastas.state.value[index];
      return [index, pasta] as const;
    },
    async getById(id: number) {
      const index = await this.getIndexById(id);
      const pasta = _pastas.state.value[index];
      return pasta;
    },
    removeAt(index: number) {
      _pastas.state.value = _pastas.state.value.toSpliced(index, 1);
    },
    push(...pastas: T[]) {
      _pastas.state.value = [..._pastas.state.value, ...pastas];
    },
    pushAt(index: number, pasta: T) {
      _pastas.state.value = _pastas.state.value.toSpliced(index, 0, pasta);
    },
    mutateAt(index: number, pasta: T) {
      _pastas.state.value = _pastas.state.value.with(index, pasta);
    },
  };
}
