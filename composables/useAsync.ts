import {
  type UseAsyncStateOptions,
  useAsyncState as useVueUseAsyncState,
} from "@vueuse/core";

export const USE_ASYNC_STATE_DEFAULT_OPTIONS = {
  immediate: true,
  shallow: true,
  throwError: true,
  resetOnExecute: false,
} as const satisfies UseAsyncStateOptions<true>;

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

  const initialization = useInitialization(_options.immediate);

  const asyncState = useVueUseAsyncState(promiseOrAsyncFn, initialState, {
    ..._options,
    onError(error) {
      initialization.tryStop();
      _options.onError?.(error);
    },
    onSuccess(data) {
      initialization.tryStop();
      _options.onSuccess?.(data);
    },
  });

  return {
    ...asyncState,
    isInitializing: initialization.state satisfies Ref<boolean>,
    isRefreshing: computed(
      () => !initialization.state.value && asyncState.isLoading.value,
    ),
    async execute(delay = 0, ...args: Params) {
      const result = await asyncState.execute(delay, ...args);
      initialization.tryStop();
      return result;
    },
  };
}

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
  const asyncState = useVueUseAsyncState(
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
  const asyncState = useVueUseAsyncState(
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
