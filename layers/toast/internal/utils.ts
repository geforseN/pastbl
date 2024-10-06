import { raiseToastMethod } from "./raise-method";
import type { RawActionToastsMethodsKeyToTransform } from "./types";

export const revertedAliases = new Map([
  ["failure", "failures"],
  ["fail", "failures"],
  ["info", "infos"],
  ["warning", "warnings"],
  ["warn", "warnings"],
] as const);

const aliases = new Map([
  ["failures", ["failure", "fail"]],
  ["infos", ["info"]],
  ["warnings", ["warning", "warn"]],
] as const satisfies [RawActionToastsMethodsKeyToTransform, string[]][]);

export const validTypes = [
  ...Array.from(aliases.values()),
  ...raiseToastMethod.typeWithAlias,
].flat();

export const additionalMethods = Array.from(aliases.values()).flat();

export const baseMethods = ["add" as const, ...raiseToastMethod.typeWithAlias];
