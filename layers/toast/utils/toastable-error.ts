import type { INotification, ActionToastsContext } from "./types";

export abstract class ToastableError extends Error {
  // this constructor is not useless because it has different signature
  // name property is not defined by ToastableError derived classes
  // although derived can defined get name() or initialize name proprerty
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }

  abstract toToast(context: ActionToastsContext): INotification;
}
