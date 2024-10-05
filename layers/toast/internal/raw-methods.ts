import { revertedAliases } from "../internal/utils";
import type { RawActionToastsMethods, AdditionalMethodName } from "./types";

export class RawActionToastsMethods_<M extends RawActionToastsMethods> {
  constructor(public readonly methods: M) {}

  get hasSuccessMethod() {
    return typeof this.methods.success === "function";
  }

  makeHandler(key: AdditionalMethodName, context: ActionToastsContext) {
    const methodsRecordName = revertedAliases.get(key);
    if (!methodsRecordName) {
      throw new Error(`Action toast '${key}' not found`);
    }
    const methodsRecord = this.methods[methodsRecordName];
    if (!methodsRecord) {
      throw new Error(`Action toast '${methodsRecordName}' not found`);
    }
    return function <
      MethodsRecord extends typeof methodsRecord,
      MethodsRecordKey extends keyof MethodsRecord,
    >(
      methodName: MethodsRecordKey,
      ...args: Parameters<MethodsRecord[MethodsRecordKey]>
    ): ReturnType<MethodsRecord[MethodsRecordKey]> {
      if (typeof methodName !== "string") {
        throw new TypeError("Method name must be a string");
      }
      if (!(methodName in methodsRecord)) {
        throw new Error(
          `Action toast '${methodsRecordName}.${methodName}' not found`,
        );
      }
      const method = methodsRecord[methodName];
      if (typeof method !== "function") {
        throw new TypeError(
          `Action toast '${methodsRecordName}.${methodName}' must be a function`,
        );
      }
      const notification = method.apply(context, args);
      return notification as ReturnType<MethodsRecord[MethodsRecordKey]>;
    };
  }
}
