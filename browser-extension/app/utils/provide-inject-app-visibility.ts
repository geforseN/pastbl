const key = Symbol("appVisibility");

export function injectAppVisibility() {
  const appVisibility = inject<
    ReturnType<typeof useAppVisibility>["appVisibility"]
  >(key);
  if (!appVisibility) {
    throw new Error("isAppVisible is not provided");
  }
  return appVisibility;
}

export function useAppVisibility() {
  const appVisibility = reactive(useBool());

  function provideAppVisibility() {
    provide(key, appVisibility);
  }

  return {
    appVisibility,
    provideAppVisibility,
    withProvide() {
      provideAppVisibility();
      return {
        appVisibility,
      };
    },
  };
}
