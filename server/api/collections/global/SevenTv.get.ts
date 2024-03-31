import { create7TVGlobalCollection } from "~/integrations";
import { get7TVGlobalEmotesSet } from "~/integrations/SevenTV/SevenTV.api";

export async function getSevenTVGlobalCollection() {
  const globalEmotes = await get7TVGlobalEmotesSet();
  return create7TVGlobalCollection(globalEmotes);
}

export default defineEventHandler(async () => {
  console.log("GET api/collections/global/SevenTV");
  return await getSevenTVGlobalCollection();
});
