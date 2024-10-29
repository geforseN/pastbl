import { consola as _consola } from "@/utils/consola";

export const pastas = ref<unknown[]>([]);

const consola = _consola.withTag("pastas.store");

watch(() => pastas.value.length, () => {
  consola.log(pastas.value);
});
