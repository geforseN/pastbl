import type { ToastableError } from "../utils/toastable-error";
import type { Notification } from "../utils/types";
import type { raiseToastMethod } from "./raise-method";
import type { additionalMethods, validTypes } from "./utils";

type ToastMaker<RawGroup extends RawActionToastMakersGroup> = <K extends keyof RawGroup>(
  key: K,
  ...args: Parameters<RawGroup[K]>
) => ReturnType<RawGroup[K]>;

type ToastMakers<
  NewKeys extends string,
  RawGroup extends RawActionToastMakersGroup,
> = Record<NewKeys, ToastMaker<RawGroup>>;

export type Warning_<G extends RawActionToastMakersGroup | undefined> =
G extends RawActionToastMakersGroup
  ? ToastMakers<"warning" | "warn", G>
  : Record<string, never>;

export type Success_<
  M extends RawActionToastMaker | undefined,
> =
  M extends RawActionToastMaker
    ? {
        (...args: Parameters<M>): ReturnType<M>;
        success(...args: Parameters<M>): ReturnType<M>;
      }
    : Record<string, never>;

type RaiseRecord<FN> = Record<RaiseMethodName, FN>;

export type Failure_<G extends RawActionToastMakersGroup | undefined> =
G extends RawActionToastMakersGroup
  ?
  & RaiseRecord<ActionToastsPanicFn<G>>
  & ToastMakers<"failure" | "fail", G>
  : RaiseRecord<ActionToastsPanicFn2>;

export type Info_<G extends RawActionToastMakersGroup | undefined> = G extends RawActionToastMakersGroup
  ? ToastMakers<"info", G>
  : Record<string, never>;

export type PossibleProperty = (typeof validTypes)[number] | "add" | "success";

export type AdditionalMethodName = (typeof additionalMethods)[number];

export type RaiseMethodName = (typeof raiseToastMethod.typeWithAlias)[number];

export type ActionToastsMethodsKey = keyof RawActionToastsMethods;

export type ActionToastsMethodsKeyToTransform = Exclude<
  ActionToastsMethodsKey,
  "success"
>;

export interface RawActionToastMaker {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (this: ActionToastsThis, ...args: any[]): Partial<Notification>;
}

type RawActionToastMakersGroup = Record<string, RawActionToastMaker>;

export type RawActionToastsMethods = {
  success?: RawActionToastMaker;
  warnings?: RawActionToastMakersGroup;
  failures?: RawActionToastMakersGroup;
  infos?: RawActionToastMakersGroup;
};

export type ActionToastsPanicFn<T extends RawActionToastsMethods["failures"]> =
  (<K extends keyof T>(
    key: K,
    ...args: Parameters<NonNullable<T>[K]>
  ) => never) &
  ((error: Error) => never) &
  ((toastableError: ToastableError) => never) &
  ((maybeError?: unknown) => never);

export type ActionToastsPanicFn2 = (...args: unknown[]) => never;
// FIXME: for now it just throws generic error
// ((error: Error) => never)
// & ((toastableError: ToastableError) => never)
// & ((maybeError?: unknown) => never);

export type ContextifyActionToasts<T extends RawActionToastsMethods> =
  Warning_<T["warnings"]> &
  Success_<T["success"]> &
  Failure_<T["failures"]> &
  Info_<T["infos"]> &
  {
    add: (
      makeNotification: (
        i18n: ActionToastsThis["i18n"],
      ) => Partial<Notification>,
    ) => void;
  };
