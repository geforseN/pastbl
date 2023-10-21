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
  const ffz = useMyAsyncState(async () => {
    const ffz = await fetchFFZByUserTwitchNickname(toValue(userTwitchNickname));
    console.log({ ffz });
    return ffz;
  });

  const ffzRoom = useMyAsyncState(async (twitchId: number) => {
    const ffzRoom = await fetchFFZUserRoomByTwitchId(twitchId);
    console.log({ ffzRoom });
    return ffzRoom;
  });

  const bttv = useMyAsyncState(async (twitchId: number) => {
    const bttv = await fetchBetterTTVUserByTwitchId(twitchId);
    console.log({ bttv });
    return bttv;
  });

  const seventv = useMyAsyncState(async (twitchId: number) => {
    const seventv = await sevenTVApi.fetchUserByTwitchId(twitchId);
    console.log({ seventv });
    return seventv;
  });

  const seventvSet = useMyAsyncState(
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
  );

  function clearEveryState() {
    [ffz, ffzRoom, bttv, seventv, seventvSet].forEach((collection) => {
      collection.state.value = null;
      collection.error.value = undefined;
      collection.isReady.value = false;
      collection.isLoading.value = false;
    });
  }

  const fetch = useMyAsyncState(async () => {
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
  });

  return {
    ffz,
    ffzRoom,
    bttv,
    seventv,
    seventvSet,
    fetch,
  };
};
