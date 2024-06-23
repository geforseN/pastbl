import type { MyKeyValueSchema } from "~/client-only/IndexedDB";

export function useThemes() {
  const { state: selected } = useIndexedDBKeyValue(
    "app:daisyui-theme",
    "system",
  );

  const { t } = useI18n();

  const entries = computed(
    () =>
      [
        ["system", t("theme.$system")],
        ["dark", t("theme.$dark")],
        ["light", t("theme.$light")],
      ] as const satisfies [MyKeyValueSchema["app:daisyui-theme"], string][],
  );

  onMounted(() => {
    watchImmediate(selected, (selected) => {
      document.documentElement.dataset.theme = selected;
    });
  });

  return {
    selected,
    entries,
  };
}
