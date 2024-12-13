import { readonly, computed, ref, isReadonly } from "vue";
import { watchImmediate } from "@vueuse/core";
import type { ComputedRef, Ref } from "vue";
import { useIndexedDBKeyValue } from "../../../../key-value/indexed-db/composables/useIndexedDBKeyValue";
import { assert } from "../../../../../app/utils/assert";

export type PastasWorkMode = "remote" | "local";

export function usePastasWorkMode(
  defaultValue: PastasWorkMode,
  {
    isOnline,
    isLoggedIn,
  }: { isOnline: Ref<boolean>; isLoggedIn: ComputedRef<boolean> },
) {
  assert.ok(isReadonly(isOnline));
  const workMode = useIndexedDBKeyValue("pastas:work-mode", defaultValue, {
    onRestored(value) {
      isClient.value = value === "local";
    },
  });

  const isClientMode = ref(defaultValue === "local");
  const isServerMode = ref(defaultValue === "remote");
  const isClient = computed({
    get() {
      return isClientMode.value;
    },
    set(value) {
      isClientMode.value = value;
      isServerMode.value = !value;
      workMode.state.value = value ? "local" : "remote";
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
    canBeRemote: canHaveServerMode,
    canHaveServerModeStatus: serverModeStatus,
    remoteModeStatus: serverModeStatus,
    remoteBlockStatusIncludes(key: "offline" | "not-logged-in") {
      return serverModeStatus.value.includes(key);
    },
    workMode,
    isServer: readonly(isServerMode),
    isClient,
    isLocal: isClient,
    isRemote: readonly(isServerMode),
  };
}
