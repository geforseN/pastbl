export function useUrlQueryParam(queryParamKey: string) {
  const params = useUrlSearchParams("history", {
    //  NOTE: useRoute().query is used, because useUrlSearchParams on server just return reactive initialValue
    //  LINK: https://github.com/vueuse/vueuse/blob/main/packages/core/useUrlSearchParams/index.ts#L52
    //  NOTE: on server there is no window and no params, but server has query, which is Record<string, string>
    initialValue: useRoute().query,
  });
  return computed({
    get: () =>
      typeof params[queryParamKey] === "string"
        ? (params[queryParamKey] as string)
        : "",
    set: (value) => {
      if (typeof value !== "string") {
        throw new TypeError(
          "new value for params[queryParamKey] is not string",
        );
      }
      if (value) {
        params[queryParamKey] = value;
      } else {
        delete params[queryParamKey];
      }
    },
  });
}
