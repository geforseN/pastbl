export const PASTAS_API = {
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
  getPastas(cursor: string | null) {
    return $fetch("/api/v1/pastas", {
      query: {
        cursor,
      },
    });
  },
};
