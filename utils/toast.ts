import { ExtendedError } from "~/utils/error";
import {
  getFailureNotification,
  type FailureNotificationName,
} from "~/utils/toast/failure";
import {
  getSuccessNotification,
  type SuccessNotificationName,
} from "~/utils/toast/success";
import {
  getWarningNotification,
  type WarningNotificationName,
} from "~/utils/toast/warning";

const getters = {
  failure: getFailureNotification,
  success: getSuccessNotification,
  warning: getWarningNotification,
} as const;

type NotificationStatus = keyof typeof getters;

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
    raise<K extends FailureNotificationName>(name: K, ...args: any[]) {
      const error = this.notify(name, ...args);
      throw error;
    },
  };

  return {
    notify<S extends NotificationStatus, K extends NotificationNameOfStatus<S>>(
      status: S,
      fnName: K,
      ...args: any[]
    ) {
      const getter = getters[status];
      const notification = getter(t, fnName, ...args);
      return toast.add(notification);
    },
    fail<K extends FailureNotificationName>(name: K, ...args: any[]) {
      return failure.notify(name, ...args) as unknown as ExtendedError;
    },
    __g__() {
      // TODO: fix args type infer (remove any, add some cool type)
      this.notify("success", "collectionFetched");
    },
    success: {
      notify<K extends SuccessNotificationName>(fnName: K, ...args: any[]) {
        const notification = getSuccessNotification(t, fnName, ...args);
        return toast.add(notification);
      },
    },
    warning: {
      notify<K extends WarningNotificationName>(fnName: K, ...args: any[]) {
        const notification = getWarningNotification(t, fnName, ...args);
        return toast.add(notification);
      },
    },
    _add: toast.add,
    tryRaise(reason: unknown): never {
      assert.isError(reason, ExtendedError);
      toast.add(reason);
      throw reason;
    },
    failure,
  };
}
