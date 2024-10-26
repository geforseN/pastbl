import { createPasta } from "~~/database/pastas.ts";

export default defineEventHandler(async (event) => {
  const userTwitchId = await requireUserTwitchIdFromSession(event);
  const { text, tags, publicity } = await getPastaFromBody(event);
  const pasta = await createPasta(text, tags, userTwitchId, publicity);
  return {
    pasta,
  };
});
