import { create7TVUserChannelSet } from "~/integrations";
import {
  get7TVSetById,
  get7TVUserProfileByTwitchId,
} from "~/integrations/SevenTV/SevenTV.api";
import { SevenTVUserNotFoundError } from "~/integrations/SevenTV/UserNotFoundError";
import { SevenTVCollectionOwner } from "~/integrations/SevenTV/entity/SevenTVCollectionOwner";
import { SevenTVUserCollection } from "~/integrations/SevenTV/entity/SevenTVUserCollection";

export const use7TVUser = (twitchId: number, nickname?: string) => {
  const isUserExist = ref(false);
  const _rawUserProfile = ref();

  const collection = useLazyAsyncData(
    `SevenTVCollection:${twitchId}`,
    async () => {
      try {
        const profile = await get7TVUserProfileByTwitchId(twitchId);
        _rawUserProfile.value = profile;
        return makeObjectFrozen(
          new SevenTVUserCollection(new SevenTVCollectionOwner(profile), [
            create7TVUserChannelSet(profile.emote_set),
          ]),
        );
      } catch (error) {
        assertIsError(error);
        if (error instanceof SevenTVUserNotFoundError) {
          throw error;
        }
      }
    },
    {
      immediate: false,
      deep: false,
    },
  );
  const activeSet = useLazyAsyncData(
    `SevenTVActiveSet:${twitchId}`,
    async () => {
      if (!collection.data.value) {
        throw new Error("Can not get SevenTV active set without collection");
      }
      const { activeSet } = collection.data.value;
      // TODO : make isValid always false for second api call test
      if (activeSet.isValid) {
        return activeSet;
      }
      const setToPrepare = await get7TVSetById(activeSet.id);
      return create7TVUserChannelSet(setToPrepare);
    },
    {
      immediate: false,
      deep: false,
    },
  );

  const fullCollection = useAsyncData(`SevenTV:${twitchId}`, async () => {
    console.log("fetching full collection");
    const coll = await collection.then((collection) => {
      collection.execute();
      return collection;
    });
    const set = await activeSet.execute();
    // TODO change return value
    return { coll, set };
  });

  return {
    _rawUserProfile,
    collection,
    activeSet,
    isUserExist,
    fullCollection,
    // TODO remove below commented code
    // isPending: computed(
    //   () => collection.pending.value && activeSet.pending.value,
    // ),
    // error: computed(() => collection.error.value || activeSet.error.value),
  };
};
