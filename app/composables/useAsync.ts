import {
  type UseAsyncStateOptions,
  useAsyncState as useVueUseAsyncState,
} from "@vueuse/core";

const ASYNC_STATE_DEFAULT_SHALLOW = true as const;

export const USE_ASYNC_STATE_DEFAULT_OPTIONS = {
  immediate: true,
  shallow: ASYNC_STATE_DEFAULT_SHALLOW,
  throwError: true,
  resetOnExecute: false,
} as const satisfies UseAsyncStateOptions<typeof ASYNC_STATE_DEFAULT_SHALLOW>;

export function useMyAsyncState<
  Data,
  Parameters extends unknown[] = [],
  Shallow extends boolean = true,
>(
  promiseOrAsyncFn: Promise<Data> | ((...args: Parameters) => Promise<Data>),
  initialState: Data,
  options: UseAsyncStateOptions<Shallow, Data> = {},
) {
  const _options = { ...USE_ASYNC_STATE_DEFAULT_OPTIONS, ...options };

  const isInitialized = useBool(_options.immediate);

  const asyncState = useVueUseAsyncState(promiseOrAsyncFn, initialState, {
    ..._options,
    onError(error) {
      isInitialized.trySet(false);
      _options.onError?.(error);
    },
    onSuccess(data) {
      isInitialized.trySet(false);
      _options.onSuccess?.(data);
    },
  });

  return {
    ...asyncState,
    isInitializing: isInitialized.state satisfies Ref<boolean>,
    isRefreshing: computed(
      () =>
        (!isInitialized.state.value &&
          asyncState.isLoading.value) satisfies boolean,
    ),
    async execute(delay = 0, ...args: Parameters) {
      const result = await asyncState.execute(delay, ...args);
      isInitialized.trySet(false);
      return result;
    },
  };
}

export function useAsyncArray<
  Data extends unknown[],
  Parameters extends unknown[] = [],
  Shallow extends boolean = true,
>(
  promiseOrAsyncFn: Promise<Data> | ((...args: Parameters) => Promise<Data>),
  options: UseAsyncStateOptions<Shallow, Data> = {},
) {
  const _options = { ...USE_ASYNC_STATE_DEFAULT_OPTIONS, ...options };
  const asyncState = useVueUseAsyncState(
    promiseOrAsyncFn,
    [] as unknown as Data,
    _options,
  );
  return {
    ...asyncState,
    execute(...args: Parameters) {
      return asyncState.execute(0, ...args);
    },
  };
}

export function useAsyncObject<
  Data extends object,
  Parameters extends unknown[] = [],
  Shallow extends boolean = true,
>(
  promiseOrAsyncFn: Promise<Data> | ((...args: Parameters) => Promise<Data>),
  options: UseAsyncStateOptions<Shallow, Data> = {},
) {
  const _options = { ...USE_ASYNC_STATE_DEFAULT_OPTIONS, ...options };
  const asyncState = useVueUseAsyncState(
    promiseOrAsyncFn,
    {} as unknown as Data,
    _options,
  );
  return {
    ...asyncState,
    execute(...args: Parameters) {
      return asyncState.execute(0, ...args);
    },
  };
}
