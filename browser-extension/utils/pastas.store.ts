import { consola } from "@/utils/consola";

export const pastas = ref<unknown[]>([]);

watch(() => pastas.value.length, (...args) => {
  consola.log(pastas.value, args);
});
