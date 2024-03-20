import {
  formatTimeAgo,
  type UseTimeAgoMessages,
  type UseTimeAgoOptions,
  type UseTimeAgoUnitNamesDefault,
} from "@vueuse/core";
import { assert } from "./error";

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

const russianTimeRules = {
  second: ["секунд", "секунду", "секунды", "секунд"],
  minute: ["минут", "минуту", "минуты", "минут"],
  hour: ["часов", "час", "часа", "часов"],
  day: ["дней", "день", "дня", "дней"],
};

// FIXME: большинство окончаний неверны
export const RUSSIAN_CONDITIONAL_MESSAGES = {
  justNow: "только что",
  past: (n) => (n.match(/\d/) ? `${n} назад` : n),
  future: (n) => (n.match(/\d/) ? `через ${n}` : n),
  month: (n, past) =>
    n === 1
      ? past
        ? "в прошлом месяце"
        : "в следующем месяце"
      : `${n} месяц${n < 5 ? "а" : "ев"}`,
  year: (n, isPast) => {
    assert.ok(Number.isInteger(n));
    if (n === 1) {
      if (isPast) {
        return "в прошлом году";
      }
      return "в следующем году";
    }
    const decade /* 0..9 */ = n % 10;
    const hundred /* 0..99 */ = n % 100;

    if (decade === 1 && hundred !== 11) {
      return `${n} год`;
    }
    if (decade >= 2 && decade <= 4 && hundred >= 12 && hundred <= 14) {
      return `${n} года`;
    }
    return `${n} лет`;
  },
  day: (n /* NOTE: only 1..31 tested, other may be wrong */, isPast) => {
    if (n === 1) {
      if (isPast) {
        return "вчера";
      }
      return "завтра";
    }
    const decade /* 0..9 */ = n % 10;
    const hundred /* 0..99 */ = n % 100;
    const isTeen = hundred > 10 && hundred < 20;
    if (decade === 1) {
      if (!isTeen) {
        return `${n} день`;
      }
    }
    if (decade >= 2 && decade <= 4) {
      if (!isTeen) {
        return `${n} дня`;
      }
    }
    return `${n} дней`;
  },
  week: (n, past) =>
    n === 1
      ? past
        ? "на прошлой неделе"
        : "на следующей неделе"
      : `${n} недел${n === 1 ? "я" : n < 5 ? "и" : "ь" /* NOTE: wrong when n > 20 */}`,
  hour: (n) => ruTimeOf("hour")(n),
  minute: (n) => ruTimeOf("minute")(n),
  second: (n) => ruTimeOf("second")(n),
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

export function useI18nTimeAgo<
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

  const timeAgo = computed(() =>
    formatTimeAgo(
      new Date(toValue(time)),
      options_ as UseTimeAgoOptions<boolean, UnitNames>,
      toValue(now),
    ),
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

function getRussianPluralIndex(n: number) {
  if (n === 0) {
    return 0;
  }
  const last /* 0..9 */ = n % 10;
  const inTeen /* is between 11 and 19 */ = n > 10 && n < 20;
  if (!inTeen) {
    if (last === 1) {
      return 1;
    }
    if (last >= 2 && last <= 4) {
      return 2;
    }
  }
  return 3;
}

function ruTimeOf(key: keyof typeof russianTimeRules) {
  return (n: number) => {
    assert.ok(Number.isInteger(n));
    const index = getRussianPluralIndex(n);
    return `${n} ${russianTimeRules[key][index]}`;
  };
}
