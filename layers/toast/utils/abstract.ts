export abstract class ToastableError extends Error {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }

  abstract toToast(context: ActionToastsThis): Partial<Notification>;
}
