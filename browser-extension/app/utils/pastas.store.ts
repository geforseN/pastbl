import { consola as _consola } from "~/utils/consola";

export type XPasta = {
  id: number;
  text: string;
  publishedAt: string;
  lastUpdatedAt: string | null;
  publicity: string;
  tags: {
    value: string;
  }[];
};

export const $pastas = ref<XPasta[]>([]);

export const $cursor = ref<Nullish<number>>(null);

const consola = _consola.withTag("pastas.store");

watch(() => $pastas.value.length, () => {
  consola.success($pastas.value);
});

export function $pushPasta(pasta: XPasta) {
  return $pastas.value.push(pasta);
}

export function $handlePastasLoadResponse(response: { pastas: XPasta[]; cursor: number | null }) {
  $pastas.value.unshift(...response.pastas.toReversed());
  $cursor.value = response.cursor;
}
