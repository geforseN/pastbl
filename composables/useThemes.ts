import type { MyKeyValueSchema } from "~/client-only/IndexedDB";

export function useThemes() {
  const { state: selected } = useIndexedDBKeyValue(
    "app:daisyui-theme",
    "system",
  );

  const { locale, t } = useI18n();
  const entries = computedWithControl(
    locale,
    () =>
      [
        ["system", t("theme.system")],
        ["dark", t("theme.dark")],
        ["light", t("theme.light")],
      ] satisfies [MyKeyValueSchema["app:daisyui-theme"], string][],
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
