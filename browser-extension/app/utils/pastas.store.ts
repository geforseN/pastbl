import { consola as _consola } from "~/utils/consola";

export const $pastas = ref<XPasta[]>([]);

export const $cursor = ref<Nullish<number>>(null);

const consola = _consola.withTag("pastas.store");

watch(() => $pastas.value.length, () => {
  consola.success($pastas.value);
});

export function $pushPasta(pasta: XPasta) {
  return $pastas.value.push(pasta);
}

export function $requirePastaAt(index: number) {
  const pasta = $pastas.value.at(index);
  if (!pasta) {
    throw new Error(`Pasta with index=${index} not found`);
  }
  return pasta;
}

export function $handlePastasLoadResponse(response: GetPastasResponse) {
  $pastas.value.unshift(...response.pastas.toReversed());
  $cursor.value = response.cursor;
}
