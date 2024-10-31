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

export const pastas = ref<XPasta[]>([]);

const consola = _consola.withTag("pastas.store");

watch(() => pastas.value.length, () => {
  consola.success(pastas.value);
});
