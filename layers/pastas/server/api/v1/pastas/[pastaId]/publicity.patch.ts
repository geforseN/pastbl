import { patchPasta } from "~~/database/pastas";

export default defineEventHandler(async (event) => {
  const userTwitchId = await requireUserTwitchIdFromSession(event);
  const pastaId = getPastaIdParam(event);
  const text = await getPastaTextFromBody(event);
  const pasta = await patchPasta(pastaId, userTwitchId, { text });
  return {
    lastUpdatedAt: pasta.lastUpdatedAt,
  };
});
