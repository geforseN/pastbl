import {
  getPastas,
} from "$/pastas/layers/remote-pastas/server/database/pastas.methods.ts";

export default defineEventHandler(async (event) => {
  setHeaders(event, {
    "Access-Control-Allow-Origin": "https://www.twitch.tv",
    "Access-Control-Allow-Credentials": "true",
  });
  const userTwitchId = await requireUserTwitchIdFromSession(event);
  const queryCursor = getPastasCursorFromQuery(event);
  const { pastas, cursor } = await getPastas(userTwitchId, queryCursor);
  return {
    pastas,
    cursor,
  };
});
