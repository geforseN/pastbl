import { removePastaTag } from "~~/db/pastas_tags";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const pastaId = getPastaIdParam(event);
  const tag = await getPastaTagFromBody(event);
  await removePastaTag(pastaId, tag);
});
