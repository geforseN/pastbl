import { addPastaTags } from "~~/database/pastas-tags.ts";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const pastaId = getPastaIdParam(event);
  const tags = await getPastaTagsFromBody(event);
  await addPastaTags(pastaId, tags);
});
