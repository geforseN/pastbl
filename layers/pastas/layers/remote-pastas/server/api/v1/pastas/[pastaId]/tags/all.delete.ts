import { removeAllPastaTags } from "~~/database/pastas-tags";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const pastaId = getPastaIdParam(event);
  await removeAllPastaTags(pastaId);
});
