export function usePastasWorkMode(
  defaultValue: "server" | "client",
  {
    isOnline,
    isLoggedIn,
  }: { isOnline: Ref<boolean>; isLoggedIn: ComputedRef<boolean> },
) {
  assert.ok(isReadonly(isOnline));
  const workMode = useIndexedDBKeyValue("pastas:work-mode", defaultValue, {
    onRestored(value) {
      isClient.value = value === "client";
    },
  });

  const isClientMode = ref(defaultValue === "client");
  const isServerMode = ref(defaultValue === "server");
  const isClient = computed({
    get() {
      return isClientMode.value;
    },
    set(value) {
      isClientMode.value = value;
      isServerMode.value = !value;
      workMode.state.value = value ? "client" : "server";
    },
  });
  const serverModeStatus = computed(() => {
    if (!isOnline.value) {
      if (isLoggedIn.value) {
        return "offline";
      }
      return "offline&not-logged-in";
    }
    if (!isLoggedIn.value) {
      return "not-logged-in";
    }
    return "ok";
  });

  const canHaveServerMode = computed(() => serverModeStatus.value === "ok");

  watchImmediate(canHaveServerMode, (canHaveServerMode) => {
    if (import.meta.client && !canHaveServerMode) {
      isClient.value = true;
    }
  });

  return {
    canHaveServerMode,
    canHaveServerModeStatus: serverModeStatus,
    workMode,
    isServer: readonly(isServerMode),
    isClient,
  };
}
