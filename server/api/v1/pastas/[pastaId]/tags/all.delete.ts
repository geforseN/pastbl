import { removeAllPastaTags } from "~/db/pastas_tags";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const pastaId = getPastaIdParam(event);
  await removeAllPastaTags(pastaId);
});
