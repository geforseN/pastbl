import { patchPasta } from "~/db/pastas";

export default defineEventHandler(async (event) => {
  const userTwitchId = await requireUserTwitchIdFromSession(event);
  const pastaId = getPastaIdParam(event);
  const text = await getPastaTextFromBody(event);
  const pasta = await patchPasta(pastaId, userTwitchId, { text });
  return {
    updatedAt: pasta.updatedAt,
  };
});
