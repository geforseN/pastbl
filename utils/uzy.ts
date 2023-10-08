import { parse, stringify } from "zipson";
import type { SevenTVEmoteSet } from "#imports";

const uzySevenTvId = "623dec3a1aeb248de84964bf";
const uzyFirstEmoteSetId = "623dec3a1aeb248de84964bf";

export async function getFirstUzyEmoteSet() {
  const uzyFirstSetFromLocalStorage = parse(
    localStorage.getItem(`7tv::emote-sets::${uzyFirstEmoteSetId}`) || "",
  ) as SevenTVEmoteSet | "";

  if (uzyFirstSetFromLocalStorage) {
    console.log("getFirstUzyEmoteSet: return value from localStorage");
    return uzyFirstSetFromLocalStorage;
  }
  const sevenTV = new SevenTV();
  const uzy = await sevenTV.fetchUserById(uzySevenTvId);
  // FIXME: method below doing nothing
  uzy.__saveInStorage();
  const uzyEmoteSets = await uzy.fetchAllOwnEmoteSets();
  // FIXME: make func or method for below foreach
  uzyEmoteSets.fulfilledEmoteSets.forEach((emoteSet) => {
    localStorage.setItem(
      `7tv::emote-sets::${emoteSet.id}`,
      stringify(emoteSet),
    );
  });
  const firstUzySet = uzyEmoteSets.fulfilledEmoteSets.find(
    (set) => set.id === uzyFirstEmoteSetId,
  );
  if (!firstUzySet) {
    throw new Error();
  }
  console.log("getFirstUzyEmoteSet: return value from fetch");
  return firstUzySet;
}
