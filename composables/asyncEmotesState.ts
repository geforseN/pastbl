import { fetchBetterTTVUserByTwitchId } from "~/integrations/BetterTTV/BetterTTV.api";
import { sevenTVApi } from "~/integrations/SevenTV/SevenTV.api";
import {
  fetchFFZByUserTwitchNickname,
  fetchFFZUserRoomByTwitchId,
} from "~/integrations/FrankerFaceZ/FrankerFaceZ.api";

export type FFZ = ReturnType<typeof useAsyncEmotesState>["ffz"];
export type FFZRoom = ReturnType<typeof useAsyncEmotesState>["ffzRoom"];
export type BTTV = ReturnType<typeof useAsyncEmotesState>["bttv"];
export type SevenTV = ReturnType<typeof useAsyncEmotesState>["seventv"];
export type SevenTVSet = ReturnType<typeof useAsyncEmotesState>["seventvSet"];

export const useAsyncEmotesState = (userTwitchNickname: MaybeRef<string>) => {
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
    {
      immediate: false,
      throwError: true,
    },
  );

  const bttv = useAsyncState(
    async (twitchId: number) => {
      const bttv = await fetchBetterTTVUserByTwitchId(twitchId);
      console.log({ bttv });
      return bttv;
    },
    null,
    {
      immediate: false,
      throwError: true,
    },
  );

  const seventv = useAsyncState(
    async (twitchId: number) => {
      const seventv = await sevenTVApi.fetchUserByTwitchId(twitchId);
      console.log({ seventv });
      return seventv;
    },
    null,
    {
      immediate: false,
      throwError: true,
    },
  );

  const seventvSet = useAsyncState(
    async (emoteSetId: Nullish<string> = seventv.state.value?.emote_set.id) => {
      if (seventv.state.value?.emote_set.emotes) {
        console.log({
          seventvSet: seventv.state.value.emote_set,
          isFastReturn: true,
        });
        return seventv.state.value.emote_set;
      }
      if (!emoteSetId) {
        throw new Error("Can not load 7TV emote set without 7TV set id");
      }
      const seventvSet =
        (await sevenTVApi.fetchEmoteSetById(emoteSetId)) ||
        raise("SevenTV failed to load emote collection");
      console.log({ seventvSet, isFastReturn: false });
      return seventvSet;
    },
    null,
    {
      immediate: false,
      throwError: true,
    },
  );

  function clearEveryState() {
    [ffz, ffzRoom, bttv, seventv, seventvSet].forEach((collection) => {
      collection.state.value = null;
      collection.error.value = undefined;
      collection.isReady.value = false;
      collection.isLoading.value = false;
    });
  }
  const fetch = useAsyncState(
    async () => {
      clearEveryState();
      await ffz.execute().catch((error) => {
        if (ffz.state.value?.user?.twitch_id) {
          return;
        }
        [bttv, seventv].forEach((state) => {
          state.error.value = new Error(
            "Can not perform emote collections without user twitch id, which can be loaded by FrankerFaceZ API",
          );
        });
        throw error;
      });
      const twitchId = ffz.state.value!.user.twitch_id!;
      await Promise.allSettled([
        ffzRoom.execute(0, twitchId),
        bttv.execute(0, twitchId),
        seventv
          .execute(0, twitchId)
          .then((userOf7TV) => seventvSet.execute(0, userOf7TV?.emote_set.id)),
      ]);
    },
    null,
    {
      immediate: false,
      throwError: true,
    },
  );

  return {
    ffz,
    ffzRoom,
    bttv,
    seventv,
    seventvSet,
    fetch,
  };
};
