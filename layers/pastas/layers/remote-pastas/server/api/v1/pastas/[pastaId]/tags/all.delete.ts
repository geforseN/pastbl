import { removeAllPastaTags } from "~~/database/pastas-tags.ts";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const pastaId = getPastaIdParam(event);
  await removeAllPastaTags(pastaId);
});
