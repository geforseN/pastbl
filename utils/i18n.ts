import {
  formatTimeAgo,
  type UseTimeAgoMessages,
  type UseTimeAgoOptions,
  type UseTimeAgoUnitNamesDefault,
} from "@vueuse/core";

const ENGLISH_DEFAULT_MESSAGES = {
  justNow: "just now",
  past: (n) => (n.match(/\d/) ? `${n} ago` : n),
  future: (n) => (n.match(/\d/) ? `in ${n}` : n),
  month: (n, past) =>
    n === 1
      ? past
        ? "last month"
        : "next month"
      : `${n} month${n > 1 ? "s" : ""}`,
  year: (n, past) =>
    n === 1
      ? past
        ? "last year"
        : "next year"
      : `${n} year${n > 1 ? "s" : ""}`,
  day: (n, past) =>
    n === 1 ? (past ? "yesterday" : "tomorrow") : `${n} day${n > 1 ? "s" : ""}`,
  week: (n, past) =>
    n === 1
      ? past
        ? "last week"
        : "next week"
      : `${n} week${n > 1 ? "s" : ""}`,
  hour: (n) => `${n} hour${n > 1 ? "s" : ""}`,
  minute: (n) => `${n} minute${n > 1 ? "s" : ""}`,
  second: (n) => `${n} second${n > 1 ? "s" : ""}`,
  invalid: "",
} satisfies UseTimeAgoMessages<UseTimeAgoUnitNamesDefault>;

export const RUSSIAN_CONDITIONAL_MESSAGES = {
  justNow: "только что",
  past: (n) => (n.match(/\d/) ? `${n} назад` : n),
  future: (n) => (n.match(/\d/) ? `через ${n}` : n),
  month: (n, past) =>
    n === 1
      ? past
        ? "в прошлом месяце"
        : "в следующем месяце"
      : `${n} месяц${n > 1 ? "а" : ""}`,
  year: (n, past) =>
    n === 1
      ? past
        ? "в прошлом году"
        : "в следующем году"
      : `${n} год${n > 1 ? "а" : ""}`,
  day: (n, past) =>
    n === 1 ? (past ? "вчера" : "завтра") : `${n} день${n > 1 ? "а" : ""}`,
  week: (n, past) =>
    n === 1
      ? past
        ? "на прошлой неделе"
        : "на следующей неделе"
      : `${n} недел${n === 1 ? "я" : n < 5 ? "и" : "ь" /* NOTE: wrong when n > 20 */}`,
  hour: (n) => `${n} час${n === 1 ? "" : n < 5 ? "а" : "ов"}`,
  minute: (n) => `${n} минут${n > 1 ? "а" : ""}`,
  second: (n) => `${n} секунд${n > 1 ? "а" : ""}`,
  invalid: "",
} satisfies UseTimeAgoMessages<UseTimeAgoUnitNamesDefault>;

const messageByLocale = {
  ru: RUSSIAN_CONDITIONAL_MESSAGES,
  en: ENGLISH_DEFAULT_MESSAGES,
} as const;

const locales = new Set(objectKeys(messageByLocale));

function isLocale(locale: string): locale is keyof typeof messageByLocale {
  return locales.has(locale as keyof typeof messageByLocale);
}

export function useI18TimeAgo<
  UnitNames extends string = UseTimeAgoUnitNamesDefault,
>(
  time: MaybeRefOrGetter<Date | number | string>,
  options: Omit<
    UseTimeAgoOptions<boolean, UnitNames>,
    "controls" | "messages"
  > = {},
) {
  const { updateInterval = 30_000 } = options;

  const now = useNow({
    interval: updateInterval,
  });

  const { locale } = useI18n();

  const options_ = reactive({
    ...options,
    messages: computed(() => {
      assert.ok(isLocale(locale.value));
      return messageByLocale[locale.value] ?? ENGLISH_DEFAULT_MESSAGES;
    }),
  });

  const timeAgo = formatTimeAgo(
    new Date(toValue(time)),
    options_ as Omit<UseTimeAgoOptions<boolean, UnitNames>, "controls">,
    toValue(now),
  );

  return timeAgo;
}
export const pluralRules = {
  // TODO: refactor, make fast return of 3
  ru(choice: number, choicesLength: number, orgRule: unknown) {
    if (choice === 0) {
      return 0;
    }
    const last = choice % 10;
    const isTeen = choice > 10 && choice < 20;
    if (choicesLength < 4) {
      if (!isTeen && last === 1) {
        return 1;
      }
      return 2;
    }
    if (!isTeen) {
      if (last === 1) {
        return 1;
      }
      if (last >= 2 && last <= 4) {
        return 2;
      }
    }
    return 3;
  },
};
