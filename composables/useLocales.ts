export function useLocales() {
  const { locale, locales, setLocale } = useI18n();

  return {
    selected: locale,
    objects: locales,
    async change(event: Event) {
      assert.ok(event instanceof Event && event.target);
      const { value } = event.target as unknown as { value: string };
      assert.ok(typeof value === "string");
      await setLocale(value);
    },
  };
}
