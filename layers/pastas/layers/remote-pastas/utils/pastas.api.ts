import type { RemotePastasPaginationCursor } from "~/brands";

export const pastasAPI = {
  postPasta(text: string, tags: string[], isPublic: boolean) {
    return $fetch("/api/v1/pastas", {
      method: "POST",
      body: {
        text,
        tags,
        publicity: isPublic ? "public" : "private",
      },
    });
  },
  deletePasta(pastaId: number) {
    return $fetch(`/api/v1/pastas/${pastaId}`, { method: "DELETE" });
  },
  getPastas(cursor: RemotePastasPaginationCursor) {
    return $fetch("/api/v1/pastas", {
      query: {
        cursor,
      },
    });
  },
};
