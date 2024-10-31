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

      consola.debug("loading pastas");
      await fetchFirstPastas()
        .then(() => status.value = "ready")
        .catch((error) => {
          status.value = isNotAuthorizedError(error)
            ? "not-authorized"
            : "unknown-error";
        });
    },
  };
}
