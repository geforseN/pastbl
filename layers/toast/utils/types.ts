import type { VueI18n } from "vue-i18n";

export type { VueI18n } from "vue-i18n";

export type ActionToastsThis = { i18n: VueI18n };

export type ActionToastsContext = ActionToastsThis;

export type Notification = {
  title?: string;
  description?: string;
  timeout?: number;
  click?: (...args: unknown[]) => void;
  callback?: (...args: unknown[]) => void;
};
