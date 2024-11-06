import {
  addPastaTags,
} from "$/pastas/layers/remote-pastas/server/database/pastas-tags.methods.ts";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const pastaId = getPastaIdParam(event);
  const tags = await getPastaTagsFromBody(event);
  await addPastaTags(pastaId, tags);
});
