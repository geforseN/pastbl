export function refWithDebounced<T>(value: T, delay = 700) {
  const valueAsRef = ref(value);
  const debounced = refDebounced(valueAsRef, delay);
  return [valueAsRef, debounced];
}

export { refWithDebounced as pls_remove_me_or_refactor_me };
