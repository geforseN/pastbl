import type { VueI18n } from "vue-i18n";
import type { raiseToastMethod } from "../internal/raise-method";
import type { ToastableError } from "$/toast/utils/abstract";

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

export interface RawActionToastMaker {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (this: ActionToastsThis, ...args: any[]): Partial<Notification>;
}

export type RawActionToastsMethods = {
  success?: RawActionToastMaker;
  warnings?: Record<string, RawActionToastMaker>;
  failures?: Record<string, RawActionToastMaker>;
  infos?: Record<string, RawActionToastMaker>;
};

export type SoRawActionToasts = {
  readonly action: {
    readonly name: string;
  };
} & RawActionToastsMethods;

export type ActionToastsPanicFn<T extends RawActionToastsMethods["failures"]> =
  | (<K extends keyof T>(
    key: K,
    ...args: Parameters<NonNullable<T>[K]>
  ) => never)
  | ((error: Error) => never)
  | ((toastableError: ToastableError) => never)
  | ((maybeError?: unknown) => never);

type Success_<S> = S extends {
  success(...args: infer Args): infer R;
} ? {
      (...args: Args): R;
      success(...args: Args): R;
    }
  : () => void;

export type ParsedActionToasts<R extends RawActionToastsMethods> =
  Success_<R>
  & {
    [F in typeof raiseToastMethod.typeWithAlias[number]]: ActionToastsPanicFn<R["failures"]>;
  }
  & {
    add(makeNotification: (i18n: ActionToastsThis["i18n"]) => Notification): void;
  };

export type CreateRawActionToastsReturn = {
  action: {
    name: string;
  };
  methods: RawActionToastsMethods;
};
