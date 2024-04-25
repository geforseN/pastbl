import type { UserSessionComposable } from "#auth-utils";

export function usePastasWorkMode(
  defaultValue: "server" | "client",
  userSession: UserSessionComposable,
  isOnline: Ref<boolean>,
) {
  const workMode = useIndexedDBKeyValue("pastas:work-mode", defaultValue, {
    onRestored(value) {
      isClientMode.value = value === "client";
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
  const canHaveServerModeStatus = computed(() => {
    if (!isOnline.value) {
      if (userSession.loggedIn.value) {
        return "offline";
      }
      return "offline&not-logged-in";
    }
    if (!userSession.loggedIn.value) {
      return "not-logged-in";
    }
    return "ok";
  });

  const canHaveServerMode = computed(
    () => canHaveServerModeStatus.value === "ok",
  );

  watchImmediate(canHaveServerMode, (canHaveServerMode) => {
    if (process.client && !canHaveServerMode) {
      sleep(1000).then(() => {
        isClient.value = true;
      });
    }
  });

  return {
    canHaveServerMode,
    canHaveServerModeStatus,
    workMode,
    isServer: readonly(isServerMode),
    isClient,
  };
}
