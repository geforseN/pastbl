import { type UseAsyncStateOptions } from "@vueuse/core";

export const USE_ASYNC_STATE_DEFAULT_OPTIONS = {
  immediate: true,
  shallow: true,
  throwError: true,
  resetOnExecute: false,
} as const satisfies UseAsyncStateOptions<true>;

export function useAsyncArray<
  /* eslint-disable @typescript-eslint/no-explicit-any */
  Data extends any[],
  Params extends any[] = [],
  /* eslint-enable @typescript-eslint/no-explicit-any */
  Shallow extends boolean = true,
>(
  promiseOrAsyncFn: Promise<Data> | ((...args: Params) => Promise<Data>),
  options: UseAsyncStateOptions<Shallow, Data> = {},
) {
  const _options = { ...USE_ASYNC_STATE_DEFAULT_OPTIONS, ...options };
  const asyncState = useAsyncState(
    promiseOrAsyncFn,
    [] as unknown as Data,
    _options,
  );
  return {
    ...asyncState,
    execute(...args: Params) {
      return asyncState.execute(0, ...args);
    },
  };
}

export function useAsyncObject<
  Data extends object,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Params extends any[] = [],
  Shallow extends boolean = true,
>(
  promiseOrAsyncFn: Promise<Data> | ((...args: Params) => Promise<Data>),
  options: UseAsyncStateOptions<Shallow, Data> = {},
) {
  const _options = { ...USE_ASYNC_STATE_DEFAULT_OPTIONS, ...options };
  const asyncState = useAsyncState(
    promiseOrAsyncFn,
    {} as unknown as Data,
    _options,
  );
  return {
    ...asyncState,
    execute(...args: Params) {
      return asyncState.execute(0, ...args);
    },
  };
}

// TODO: remove auto-import of useAsyncState from lib and rename useMyAsyncState to useAsyncState
// NOTE: after such change composables above can use this composable
export function useMyAsyncState<
  Data,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Params extends any[] = [],
  Shallow extends boolean = true,
>(
  promiseOrAsyncFn: Promise<Data> | ((...args: Params) => Promise<Data>),
  initialState: Data,
  options: UseAsyncStateOptions<Shallow, Data> = {},
) {
  const _options = { ...USE_ASYNC_STATE_DEFAULT_OPTIONS, ...options };
  return useAsyncState(promiseOrAsyncFn, initialState, _options);
}
