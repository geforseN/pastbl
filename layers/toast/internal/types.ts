import type { ToastableError } from "../utils/toastable-error";
import type { raiseToastMethod } from "./raise-method";

type FN<Group extends RawActionToastMakersGroup> = <K extends keyof Group>(key: K, ...args: Parameters<Group[K]>) => ReturnType<Group[K]>;

type MapMethod<
  Group extends RawActionToastMakersGroup,
  NewKeys extends string,
> = Record<NewKeys, FN<Group>>;

type HasMethodGroup<V extends RawActionToastMakersGroup | undefined, OnTrue>
  = V extends RawActionToastMakersGroup ? OnTrue : Record<string, never>;

export type Warning_<M extends RawActionToastsMethods> = HasMethodGroup<
  M["warnings"],
  MapMethod<NonNullable<M["warnings"]>, "warning" | "warn">
>;

type HasMethod<M extends RawActionToastMaker | undefined, OnTrue> = M extends RawActionToastMaker ? OnTrue : Record<string, never>;

export type Success_<
  M extends RawActionToastsMethods,
  _M extends NonNullable<M["success"] > = NonNullable<M["success"]>,
> = HasMethod<M["success"], {
  (...args: Parameters<_M>): ReturnType<_M>;
  success(...args: Parameters<_M>): ReturnType<_M>;
}>;

export type Failure_<M extends RawActionToastsMethods> = M extends {
  failures: Record<string, RawActionToastMaker>;
} ?
& {
  [K in typeof raiseToastMethod.typeWithAlias[number]]: ActionToastsPanicFn<M["failures"]>
}
& {
  failure<K extends keyof M["failures"]>(name: K, ...args: Parameters<M["failures"][K]>): ReturnType<M["failures"][K]>;
  fail<K extends keyof M["failures"]>(name: K, ...args: Parameters<M["failures"][K]>): ReturnType<M["failures"][K]>;
}
  : {
      [K in typeof raiseToastMethod.typeWithAlias[number]]: ActionToastsPanicFn2;
    };

export type Info_<M extends RawActionToastsMethods> = HasMethodGroup<
  M["infos"],
  MapMethod<NonNullable<M["infos"]>, "info">
>;

export type ActionToastType = "success" | "failure" | "info" | "warning";

export type ActionToastsMethodsKey = keyof RawActionToastsMethods;

export type ActionToastsMethodsKeyToTransform = Exclude<ActionToastsMethodsKey, "success">;

export interface RawActionToastMaker {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (this: ActionToastsThis, ...args: any[]): Partial<Notification>;
}

export type RawActionToastMakersGroup = Record<string, RawActionToastMaker>;

export type RawActionToastsMethods = {
  success?: RawActionToastMaker;
  warnings?: Record<string, RawActionToastMaker>;
  failures?: Record<string, RawActionToastMaker>;
  infos?: Record<string, RawActionToastMaker>;
};

export type ActionToastsPanicFn<T extends RawActionToastsMethods["failures"]> =
  & (<K extends keyof T>(
    key: K,
    ...args: Parameters<NonNullable<T>[K]>
  ) => never)
  & ((error: Error) => never)
  & ((toastableError: ToastableError) => never)
  & ((maybeError?: unknown) => never);

export type ActionToastsPanicFn2 =
  ((...args: unknown[]) => never);
  // FIXME: for now it just throws generic error
  // ((error: Error) => never)
  // & ((toastableError: ToastableError) => never)
  // & ((maybeError?: unknown) => never);
