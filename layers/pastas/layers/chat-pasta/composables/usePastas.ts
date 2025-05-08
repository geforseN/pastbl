import { assert } from "../../../../../app/utils/assert";
import { NotFoundPastaError } from "../utils/pasta-errors";
import { getIndex } from "../../../../../app/utils/array";
import { useAsyncArray } from "../../../../../app/composables/useAsync";
import type { OmegaPasta } from "../utils/pasta";

export type UsePastasStateInstance = ReturnType<typeof usePastas>;

export function usePastas<T extends OmegaPasta>(getPastas: () => Promise<T[]>) {
  const _pastas = useAsyncArray(getPastas);

  return {
    ..._pastas,

    async getIndexById(id: number) {
      return getIndex(
        _pastas.state,
        (pasta_) => pasta_.id === id,
        () => new NotFoundPastaError(id),
      );
    },
    async getEntryById(id: number) {
      const index = await this.getIndexById(id);
      const pasta = _pastas.state.value[index];
      assert.ok(pasta);
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
