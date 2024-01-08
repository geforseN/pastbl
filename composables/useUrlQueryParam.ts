import type { WritableComputedRef } from "nuxt/dist/app/compat/vue-demi";

export function useUrlQueryParam<
  const T extends
    | StringConstructor
    | NumberConstructor
    | BooleanConstructor = StringConstructor,
>(
  queryParamKey: string,
  {
    shouldBeRemovedOnFalsyValue = true,
    TypeConstructor = String,
    defaultValue,
  }: Partial<{
    TypeConstructor: T;
    shouldBeRemovedOnFalsyValue: boolean;
    defaultValue: InstanceType<T>;
  }> = {},
) {
  const params = useUrlSearchParams("history", {
    //  NOTE: useRoute().query is used, because useUrlSearchParams on server just return reactive initialValue
    //  LINK: https://github.com/vueuse/vueuse/blob/main/packages/core/useUrlSearchParams/index.ts#L52
    //  NOTE: on server there is no window and no params, but server has query, which is Record<string, string>
    initialValue: useRoute().query,
  });
  if (defaultValue) {
    params[queryParamKey] = String(defaultValue);
  }
  const log = console.log.bind(console, "useUrlQueryParam", queryParamKey);

  return computed({
    get: () => {
      const value = params[queryParamKey] || "";
      log("get", `value=${value}`, `returnValue=${TypeConstructor(value)}`);
      return TypeConstructor(value) as InstanceType<T>;
    },
    set: (value) => {
      log(
        "set",
        `value=${value}`,
        `typeofValue=${typeof value}`,
        `valueAsString=${String(value)}`,
        `isTruthy=${!!value}`,
      );
      params[queryParamKey] = String(value);
      if (!value && shouldBeRemovedOnFalsyValue) {
        log("DELETE FROM PARAMS BAR");
        delete params[queryParamKey];
      }
    },
  });
}
