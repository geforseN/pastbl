export const useMyAsyncState = <Data, Params extends any[] = []>(
  cb: (...args: Params) => Promise<Data>,
) => {
  return useAsyncState(cb, null, {
    immediate: false,
    throwError: true,
  });
};
