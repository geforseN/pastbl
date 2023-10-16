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
      const a = await fetchFFZByUserTwitchNickname(toValue(userTwitchNickname));
      console.log(a);
      return a;
    },
    null,
    {
      immediate: false,
      throwError: true,
    },
  );
  const ffzRoom = useAsyncState(
    async (twitchId: number) => {
      const a = await fetchFFZUserRoomByTwitchId(twitchId);
      console.log(a);
      return a;
    },
    null,
    {
      immediate: false,
    },
  );

  const bttv = useAsyncState(
    async (twitchId: number) => {
      const a = await fetchBetterTTVUserByTwitchId(twitchId);
      console.log(1, a);
      return a;
    },
    null,
    { immediate: false },
  );

  const seventv = useAsyncState(
    async (twitchId: number) => {
      const a = await sevenTVApi.fetchUserByTwitchId(twitchId);
      console.log(2, a);
      return a;
    },
    null,
    { immediate: false },
  );

  const seventvSet = useAsyncState(
    async (emoteSetId = seventv.state.value?.emote_set.id) => {
      if (seventv.state.value?.emote_set.emotes) {
        return seventv.state.value.emote_set;
      }
      if (!emoteSetId) {
        throw new Error(
          "Can not load SevenTV emote collections without collection id",
        );
      }
      const emoteSet = await sevenTVApi.fetchEmoteSetById(emoteSetId);
      console.log(3, emoteSet);
      if (!emoteSet.emotes) {
        throw new Error("SevenTV failed to load emote collection");
      }
      return emoteSet;
    },
    null,
    { immediate: false },
  );

  function clearAll() {
    [ffz, ffzRoom, bttv, seventv, seventvSet].forEach((collection) => {
      collection.state.value = null;
      collection.error.value = undefined;
      collection.isReady.value = false;
      collection.isLoading.value = false;
    });
  }

  return {
    ffz,
    ffzRoom,
    bttv,
    seventv,
    seventvSet,
    isLoading,
    doMagic: async () => {
      clearAll();
      await ffz.execute(/* 10_000_000 */).catch(() => {
        [bttv, seventv].forEach((collection) => {
          console.log("eeee");

          collection.error.value = new Error(
            "Can not perform emote collections without user twitch id",
          );
        });
      });
      const twitchId = ffz.state.value?.user?.twitch_id;
      console.log(twitchId);
      if (!twitchId) {
        // TODO add ref with this error which will be shown to user (or add toast)
        throw new Error(
          "Can not perform emote collections without user twitch id",
        );
      }
      // TODO use Promise.allSettled instead
      await Promise.all([
        ffzRoom.execute(0, twitchId),
        bttv.execute(0, twitchId),
        seventv
          .execute(0, twitchId)
          .catch(() => seventvSet.execute())
          .then(() => seventvSet.execute()),
      ]);
      isLoading.value = false;
    },
  };
}

export type FFZ = ReturnType<typeof useAsyncEmoteSets>["ffz"];
export type FFZRoom = ReturnType<typeof useAsyncEmoteSets>["ffzRoom"];
export type BTTV = ReturnType<typeof useAsyncEmoteSets>["bttv"];
export type SevenTV = ReturnType<typeof useAsyncEmoteSets>["seventv"];
export type SevenTVSet = ReturnType<typeof useAsyncEmoteSets>["seventvSet"];
