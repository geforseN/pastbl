import { getPastas } from "~~/database/pastas";

export default defineEventHandler(async (event) => {
  const userTwitchId = await requireUserTwitchIdFromSession(event);
  const queryCursor = getPastasCursorFromQuery(event);
  const { pastas, cursor } = await getPastas(userTwitchId, queryCursor);
  return {
    pastas,
    cursor,
  };
});
