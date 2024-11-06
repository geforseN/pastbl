import {
  patchPasta,
} from "$/pastas/layers/remote-pastas/server/database/pastas.methods.ts";

export default defineEventHandler(async (event) => {
  const userTwitchId = await requireUserTwitchIdFromSession(event);
  const pastaId = getPastaIdParam(event);
  const text = await getPastaTextFromBody(event);
  const pasta = await patchPasta(pastaId, userTwitchId, { text });
  return {
    lastUpdatedAt: pasta.lastUpdatedAt,
  };
});
