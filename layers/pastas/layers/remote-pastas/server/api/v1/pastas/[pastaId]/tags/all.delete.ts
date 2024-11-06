import {
  removeAllPastaTags,
} from "$/pastas/layers/remote-pastas/server/database/pastas-tags.methods.ts";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const pastaId = getPastaIdParam(event);
  await removeAllPastaTags(pastaId);
});
