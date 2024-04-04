import { deletePasta } from "~/db/pastas";

export default defineEventHandler(async (event) => {
  const userTwitchId = await requireUserTwitchIdFromSession(event);
  const pastaId = getPastaIdParam(event);
  await deletePasta(userTwitchId, pastaId);
});
