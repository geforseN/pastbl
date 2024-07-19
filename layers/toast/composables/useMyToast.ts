import { ExtendedError } from "~/utils/error";
import type { TranslateFn } from "../utils/-common";

const toastsGetters = {
  failure: getFailureNotification,
  success: getSuccessNotification,
  warning: getWarningNotification,
} as const;

type NotificationStatus = keyof typeof toastsGetters;

type NotificationNameOfStatus<S extends NotificationStatus> = {
  failure: FailureNotificationName;
  success: SuccessNotificationName;
  warning: WarningNotificationName;
}[S];

export function useMyToast() {
  const toast = useNuxtToast();
  const { t } = useI18n();

  const failure = {
    of<K extends FailureNotificationName>(name: K, ...args: any[]) {
      return getFailureNotification(t, name, ...args);
    },
    notify<K extends FailureNotificationName>(name: K, ...args: any[]) {
      const error = this.of(name, ...args);
      return toast.add(error);
    },
  };

  return {
    notify<S extends NotificationStatus, K extends NotificationNameOfStatus<S>>(
      status: S,
      functionName: K,
      ...args: any[]
    ) {
      const getToast = toastsGetters[status];
      assert.ok(isFunction(getToast));
      const notification = getToast(t, functionName, ...args);
      return toast.add(notification);
    },
    fail<K extends FailureNotificationName>(name: K, ...args: any[]) {
      return failure.notify(name, ...args) as unknown as ExtendedError;
    },
    throw(reason: unknown): never {
      const error =
        reason instanceof ExtendedError
          ? reason
          : new ExtendedError(findErrorMessage(reason, t("error-occurred")));
      toast.add(
        error.mustAddLocale ? addLocaleToExtendedError(error, t) : error,
      );
      throw reason;
    },
    failure,
    _addToast: toast.add,
  };
}

function addLocaleToExtendedError(
  error: ExtendedError,
  t: TranslateFn,
) {
  if (!error.mustAddLocale) {
    return new ExtendedError(error.description, {
      ...error,
    });
  }
  return new ExtendedError(
    error.tDescriptionInterpolations
      ? t(error.description, error.tDescriptionInterpolations)
      : t(error.description),
    {
      ...error,
      title: error.title ? t(error.title) : undefined,
      mustAddLocale: false,
    },
  );
}
