export type PastasLoadStatus =
  | "loading"
  | "ready"
  | "not-authorized"
  | "unknown-error";

export function usePastasLoad() {
  const status = ref<PastasLoadStatus>("loading");

  return {
    status,
    async init(mustMock = false) {
      if (mustMock) {
        consola.debug("mocking pastas");
        status.value = "ready";
        const module = await import("~/utils/pastas.mock.json");
        if (!Array.isArray(module.default)) {
          throw new TypeError("module.default is not an array");
        }
        pastas.value = module.default;
        return;
      }
      status.value = "loading";
      consola.debug("loading pastas");
      try {
        const response = await fetchPastas();
        pastas.value.push(...response.pastas);
        status.value = "ready";
      } catch (error) {
        status.value = isNotAuthorizedError(error)
          ? "not-authorized"
          : "unknown-error";
      }
    },
  };
}
