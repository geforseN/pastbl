export type AppTheme = "system" | "dark" | "light";

export function useThemes() {
  const cookie = useCookie<AppTheme>("daisyui-theme", {
    default: () => "system",
  });
  const { state: selected } = useIndexedDBKeyValue(
    "app:daisyui-theme",
    cookie.value,
    {
      onUpdated: (selected) => {
        cookie.value = selected;
      },
    },
  );

  const { t } = useI18n();

  const entries = computed(
    () =>
      [
        ["system", t("theme.$system")],
        ["dark", t("theme.$dark")],
        ["light", t("theme.$light")],
      ] as const satisfies [AppTheme, string][],
  );

  onMounted(() => {
    watchImmediate(selected, (selected) => {
      document.documentElement.dataset.theme = selected;
    });
  });

  return {
    selected,
    entries,
    cookie,
  };
}
