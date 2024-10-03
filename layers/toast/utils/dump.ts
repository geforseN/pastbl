import type { RawActionToastsMethods } from "./types";

const actionToastsKeyToTypeRecord = {
  success: "success",
  failures: "failure",
  infos: "info",
  warnings: "warning",
} as const satisfies Record<keyof RawActionToastsMethods, string>;

const types = objectValues(actionToastsKeyToTypeRecord);

const typesSet = new Set(types);

export type ActionToastType = typeof types[number];

export type ActionToastsMethodsKey = keyof RawActionToastsMethods;

export function isActionToastType(type: string): type is ActionToastType {
  return typesSet.has(type as ActionToastType);
}

export function mapMethodKeyToType<K extends keyof RawActionToastsMethods>(key: K) {
  return actionToastsKeyToTypeRecord[key];
}
