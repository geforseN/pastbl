import {
  deletePasta,
} from "$/pastas/layers/remote-pastas/server/database/pastas.methods.ts";

export default defineEventHandler(async (event) => {
  const userTwitchId = await requireUserTwitchIdFromSession(event);
  const pastaId = getPastaIdParam(event);
  await deletePasta(userTwitchId, pastaId);
});
