import { set, type UseAsyncStateOptions } from "@vueuse/core";

// const {
//   immediate = true,
//   delay = 0,
//   onError = () => {
//     set(returnValue.state, []);
//   },
//   onSuccess = () => {},
//   resetOnExecute = true,
//   shallow = true,
//   throwError = true,
// } = options ?? {};
// https://vueuse.org/core/useAsyncState/#useasyncstate
// https://github.com/vueuse/vueuse/blob/main/packages/core/useAsyncState/index.ts
export function useAsyncArray<
  DataArray extends [],
  Params extends any[] = [],
  Shallow extends boolean = true,
>(
  promiseOrFn: Promise<DataArray> | ((...args: Params) => Promise<DataArray>),
  options?: UseAsyncStateOptions<Shallow, DataArray>,
) {
  const _options = { ...{} };
  const returnValue = useAsyncState(promiseOrFn, [] as DataArray, {});
  return {
    ...returnValue,
    execute(...args: unknown[]) {
      return returnValue.execute(0, args);
    },
  };
}
