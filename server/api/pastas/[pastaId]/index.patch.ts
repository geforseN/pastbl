import { patchPasta } from "~/db/pastas";

export default defineEventHandler(async (event) => {
  const userTwitchId = await requireUserTwitchIdFromSession(event);
  const pastaId = pastaIdParamSchema.parse(getRouterParam(event, "pastaId"));
  const patches = await getPastaPatchesFromBody(event);
  const pasta = await patchPasta(pastaId, userTwitchId, patches);
  return {
    updatedAt: pasta.updatedAt,
  };
});
