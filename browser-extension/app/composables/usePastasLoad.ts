export type PastasLoadStatus =
  | "unstarted"
  | "initializing"
  | "loading"
  | "ready"
  | "finished"
  | "not-authorized-error"
  | "service-not-available-error"
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
    async execute(cursor?: Nullish<number>) {
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
          : isServiceNotAvailableError(error)
            ? "service-not-available-error"
            : "unknown-error";
        throw error;
      }
    },
  };
}
