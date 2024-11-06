import {
  removePastaTag,
} from "$/pastas/layers/remote-pastas/server/database/pastas-tags.methods.ts";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const pastaId = getPastaIdParam(event);
  const tag = await getPastaTagFromBody(event);
  await removePastaTag(pastaId, tag);
});
