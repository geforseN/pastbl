export type PastasLoadStatus =
  | "unstarted"
  | "initializing"
  | "loading"
  | "ready"
  | "finished"
  | "not-authorized-error"
  | "unknown-error";

export function useLazyPastasLoad(
  fetchPastas: (cursor: Nullish<number>) => Promise<{
    pastas: XPasta[];
    cursor: number | null;
  }>,
) {
  const xConsola = consola.withTag("useLazyPastasLoad");
  const status = ref<PastasLoadStatus>("unstarted");

  return {
    status,
    async execute(cursor?: Nullish<number>, __mock__?: boolean) {
      if (__mock__) {
        consola.debug("mocking pastas");
        const module = await import("~/utils/pastas.mock.json");
        if (!Array.isArray(module.default)) {
          throw new TypeError("module.default is not an array");
        }
        const pastas = module.default;
        status.value = "finished";
        return {
          pastas,
          cursor: null,
        };
      }

      if (
        status.value !== "ready"
        && status.value !== "unstarted"
        && status.value !== "loading"
        && status.value !== "initializing"
      ) {
        xConsola.error(
          "status is not loading or ready, not supposed to call execute",
          { status },
        );
        throw new Error(`status is ${status.value}`);
      }

      if (status.value === "loading" || status.value === "initializing") {
        xConsola.warn("possible race condition (status is \"loading\")", { cursor });
      }

      try {
        consola.debug("loading pastas");
        if (status.value === "unstarted") {
          status.value = "initializing";
        } else if (status.value === "ready") {
          status.value = "loading";
        }
        const response = await fetchPastas(cursor);
        if (response.cursor === null) {
          status.value = "finished";
        } else {
          status.value = "ready";
        }
        return response;
      } catch (error) {
        status.value = isNotAuthorizedError(error)
          ? "not-authorized-error"
          : "unknown-error";
        throw error;
      }
    },
  };
}
