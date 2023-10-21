import { fetchBetterTTVUserByTwitchId } from "~/integrations/BetterTTV/BetterTTV.api";
import { sevenTVApi } from "~/integrations/SevenTV/SevenTV.api";
import {
  fetchFFZByUserTwitchNickname,
  fetchFFZUserRoomByTwitchId,
} from "~/integrations/FrankerFaceZ/FrankerFaceZ.api";

export default function useAsyncEmoteSets(
  userTwitchNickname: MaybeRef<string>,
) {
  const isLoading = ref(false);

  const ffz = useAsyncState(
    async () => {
      const ffz = await fetchFFZByUserTwitchNickname(
        toValue(userTwitchNickname),
      );
      console.log({ ffz });
      return ffz;
    },
    null,
    {
      immediate: false,
      throwError: true,
    },
  );
  const ffzRoom = useAsyncState(
    async (twitchId: number) => {
      const ffzRoom = await fetchFFZUserRoomByTwitchId(twitchId);
      console.log({ ffzRoom });
      return ffzRoom;
    },
    null,
    { immediate: false, throwError: true },
  );

  const bttv = useAsyncState(
    async (twitchId: number) => {
      const bttv = await fetchBetterTTVUserByTwitchId(twitchId);
      console.log({ bttv });
      return bttv;
    },
    null,
    { immediate: false, throwError: true },
  );

  const seventv = useAsyncState(
    async (twitchId: number) => {
      const seventv = await sevenTVApi.fetchUserByTwitchId(twitchId);
      console.log({ seventv });
      return seventv;
    },
    null,
    { immediate: false, throwError: true },
  );

  const seventvSet = useAsyncState(
    async (emoteSetId = seventv.state.value?.emote_set.id) => {
      if (seventv.state.value?.emote_set.emotes) {
        console.log({
          seventvSet: seventv.state.value.emote_set,
          isFastReturn: true,
        });
        return seventv.state.value.emote_set;
      }
      if (!emoteSetId) {
        console.log({
          seventvSetError:
            "Can not load SevenTV emote collections without collection id",
        });
        throw new Error(
          "Can not load SevenTV emote collections without collection id",
        );
      }
      const seventvSet = await sevenTVApi.fetchEmoteSetById(emoteSetId);
      if (!seventvSet.emotes) {
        console.log({
          seventvSetError: "SevenTV failed to load emote collection",
        });
        throw new Error("SevenTV failed to load emote collection");
      }
      console.log({ seventvSet, isFastReturn: false });
      return seventvSet;
    },
    null,
    { immediate: false, throwError: true },
  );

  function clearAll() {
    [ffz, ffzRoom, bttv, seventv, seventvSet].forEach((collection) => {
      collection.state.value = null;
      collection.error.value = undefined;
      collection.isReady.value = false;
      collection.isLoading.value = false;
    });
  }

  const fetch = useAsyncState(
    async () => {
      isLoading.value = true;
      clearAll();
      await ffz.execute().catch((error) => {
        [bttv, seventv].forEach((collection) => {
          console.log({
            error:
              "Can not perform emote collections without user twitch id, which can be loaded by FrankerFaceZ API",
          });
          collection.error.value = new Error(
            "Can not perform emote collections without user twitch id, which can be loaded by FrankerFaceZ API",
          );
        });
        throw ffz.error.value;
      });
      const twitchId = ffz.state.value?.user?.twitch_id;
      console.log({ twitchId });
      if (!twitchId) {
        throw new Error(
          "Can not perform emote collections without user twitch id, which can be loaded by FrankerFaceZ API",
        );
      }
      await Promise.allSettled([
        ffzRoom.execute(0, twitchId),
        bttv.execute(0, twitchId),
        seventv
          .execute(0, twitchId)
          .catch(() => seventvSet.execute())
          .then(() => seventvSet.execute()),
      ]);
    },
    null,
    { immediate: false, throwError: true },
  );
  return {
    ffz,
    ffzRoom,
    bttv,
    seventv,
    seventvSet,
    isLoading,
    fetch,
  };
}

export type FFZ = ReturnType<typeof useAsyncEmoteSets>["ffz"];
export type FFZRoom = ReturnType<typeof useAsyncEmoteSets>["ffzRoom"];
export type BTTV = ReturnType<typeof useAsyncEmoteSets>["bttv"];
export type SevenTV = ReturnType<typeof useAsyncEmoteSets>["seventv"];
export type SevenTVSet = ReturnType<typeof useAsyncEmoteSets>["seventvSet"];
