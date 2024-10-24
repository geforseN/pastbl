import { deletePasta } from "~~/database/pastas.ts";

export default defineEventHandler(async (event) => {
  const userTwitchId = await requireUserTwitchIdFromSession(event);
  const pastaId = getPastaIdParam(event);
  await deletePasta(userTwitchId, pastaId);
});
