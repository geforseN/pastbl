import { consola as _consola } from "@/utils/consola";

export const pastas = ref<unknown[]>([]);

const consola = _consola.withTag("pastas.store");

watch(() => pastas.value.length, () => {
  consola.success(pastas.value);
});
