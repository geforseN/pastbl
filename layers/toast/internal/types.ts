import type { ToastableError } from "../utils/toastable-error";
import type { INotification } from "../utils/types";
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

type TransformSuccess<
  M extends RawActionToastMaker | undefined,
> =
  M extends RawActionToastMaker
    ? {
        (...args: Parameters<M>): ReturnType<M>;
        success(...args: Parameters<M>): ReturnType<M>;
      }
    : Record<string, never>;

type RaiseRecord<FN> = Record<RaiseMethodName, FN>;

type TransformFailures<G extends RawActionToastMakersGroup | undefined> =
G extends RawActionToastMakersGroup
  ?
  & RaiseRecord<ActionToastsPanicFn<G>>
  & ToastMakers<"failure" | "fail", G>
  : RaiseRecord<ActionToastsPanicFn2>;

export type PossibleProperty = (typeof validTypes)[number] | "add" | "success";

export type AdditionalMethodName = (typeof additionalMethods)[number];

export type RaiseMethodName = (typeof raiseToastMethod.typeWithAlias)[number];

export type RawActionToastsMethodsKey = keyof RawActionToastsMethods;

export type RawActionToastsMethodsKeyToTransform = Exclude<
  RawActionToastsMethodsKey,
  "success"
>;

export interface RawActionToastMaker {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (this: ActionToastsThis, ...args: any[]): INotification;
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

type TransformRawGroup<
  RawGroup extends RawActionToastMakersGroup | undefined,
  NewKeys extends string,
  OnUndefined extends Record<string, unknown> = Record<string, never>,
> = RawGroup extends RawActionToastMakersGroup
  ? Record<NewKeys, ToastMaker<RawGroup>>
  : OnUndefined;

export type ContextifyActionToasts<T extends RawActionToastsMethods> =
  & TransformSuccess<T["success"]>
  & TransformRawGroup<T["infos"], "info">
  & TransformRawGroup<T["warnings"], "warn" | "warning">
  & TransformFailures<T["failures"]>
  // & TransformRawGroup<T["failures"], "fail" | "failure", RaiseRecord<ActionToastsPanicFn2>>
  & {
    add: (
      makeNotification: (
        i18n: ActionToastsThis["i18n"],
      ) => INotification,
    ) => void;
  };
