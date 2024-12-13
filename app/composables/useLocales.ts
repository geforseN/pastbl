import { assert } from "../utils/assert";
import { useI18n } from "../../node_modules//vue-i18n@10@3@5/node_modules/vue-i18n/dist/vue-i18n";

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
