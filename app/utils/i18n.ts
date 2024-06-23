import {
  formatTimeAgo,
  type UseTimeAgoMessages,
  type UseTimeAgoOptions,
  type UseTimeAgoUnitNamesDefault,
} from "@vueuse/core";
import { assert } from "./error";

const numberInRegex = /\d/;

const ENGLISH_DEFAULT_MESSAGES = {
  justNow: "just now",
  past: (n) => (numberInRegex.test(n) ? `${n} ago` : n),
  future: (n) => (numberInRegex.test(n) ? `in ${n}` : n),
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
} as const satisfies UseTimeAgoMessages<UseTimeAgoUnitNamesDefault>;

const russianTimeRules = {
  year: {
    one: {
      past: "в прошлом году",
      future: "в следующем году",
    },
    list: ["лет", "год", "года", "лет"],
  },
  month: {
    one: {
      past: "в прошлом месяце",
      future: "в следующем месяце",
    },
    list: ["месяцев", "месяц", "месяца", "месяцев"],
  },
  week: {
    one: {
      past: "на прошлой неделе",
      future: "на следующей неделе",
    },
    list: ["недель", "неделю", "недели", "недель"],
  },
  day: {
    one: {
      past: "вчера",
      future: "завтра",
    },
    list: ["дней", "день", "дня", "дней"],
  },
  minute: {
    one: {
      past: "минуту назад",
      future: "через минуту",
    },
    list: ["минут", "минуту", "минуты", "минут"],
  },
  hour: {
    one: {
      past: "час назад",
      future: "через час",
    },
    list: ["часов", "час", "часа", "часов"],
  },
  second: {
    one: {
      past: "секунду назад",
      future: "через секунду",
    },
    list: ["секунд", "секунду", "секунды", "секунд"],
  },
} as const;

const RUSSIAN_CONDITIONAL_MESSAGES = {
  justNow: "только что",
  past: (n) => (numberInRegex.test(n) ? `${n} назад` : n),
  future: (n) => (numberInRegex.test(n) ? `через ${n}` : n),
  month: getRussianTimeRuleOf("month"),
  year: getRussianTimeRuleOf("year"),
  day: getRussianTimeRuleOf("day"),
  week: getRussianTimeRuleOf("week"),
  hour: getRussianTimeRuleOf("hour"),
  minute: getRussianTimeRuleOf("minute"),
  second: getRussianTimeRuleOf("second"),
  invalid: "",
} as const satisfies UseTimeAgoMessages<UseTimeAgoUnitNamesDefault>;

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
  ru(choice: number, choicesLength: number, _orgRule: unknown) {
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
  const last /* NOTE: last is between 0 and 9 */ = n % 10;
  const inTeen /* is n between 11 and 19 */ = n > 10 && n < 20;
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

function getRussianTimeRuleOf(key: keyof typeof russianTimeRules) {
  const rule = russianTimeRules[key];
  return (n: number, isPast: boolean) => {
    assert.ok(Number.isInteger(n));
    if (n === 1) {
      const { one } = rule;
      if (isPast) {
        return one.past;
      }
      return one.future;
    }
    const index = getRussianPluralIndex(n);
    return `${n} ${rule.list[index]}`;
  };
}
