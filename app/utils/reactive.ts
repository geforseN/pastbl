import { computed } from "vue";
import type { Ref } from "vue";

export function writableComputedForKey<
  T extends object,
  K extends keyof T,
  V = T[K],
>(ref: Ref<T>, key: K) {
  return computed({
    get() {
      return ref.value[key] as V;
    },
    set(value: V) {
      (ref.value[key] as V) = value;
    },
  });
}
