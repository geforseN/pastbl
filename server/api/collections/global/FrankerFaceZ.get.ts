import { createFFZGlobalCollection } from "~/integrations/FrankerFaceZ";
import { getFFZGlobalEmoteSets } from "~/integrations/FrankerFaceZ/FrankerFaceZ.api";

export async function getFrankerFaceZGlobalCollection() {
  const globalEmotes = await getFFZGlobalEmoteSets();
  return createFFZGlobalCollection(globalEmotes);
}

export default defineEventHandler(async () => {
  console.log("GET api/collections/global/FrankerFaceZ");
  return await getFrankerFaceZGlobalCollection();
});
