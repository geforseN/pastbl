import { patchPasta } from "~~/database/pastas.ts";

export default defineEventHandler(async (event) => {
  const userTwitchId = await requireUserTwitchIdFromSession(event);
  const pastaId = getPastaIdParam(event);
  const patches = await getPastaPatchesFromBody(event);
  const pasta = await patchPasta(pastaId, userTwitchId, patches);
  return {
    lastUpdatedAt: pasta.lastUpdatedAt,
  };
});
