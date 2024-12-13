import { toValue } from "vue";
import type { MaybeRef, Ref } from "vue";
import { FetchError } from "ofetch";
import { getEmotesIntegrationsStatusAsEmojisString } from "../../../emote-integrations/utils/status";
import { toLowerCase } from "../../../../app/utils/string";
import { assert } from "../../../../app/utils/assert";
import { useAsyncObject } from "../../../../app/composables/useAsync";
import { usePersonsEmoteCollectionsStore } from "../../../../app/stores/usePersonsEmoteCollectionsStore";
import { usePersonEmotesCollectionLoadToasts } from "./toasts";

const issueCodeRecord = {
  too_small: "tooSmallInput",
  too_big: "tooBigInput",
};

export function usePersonEmotesCollectionLoad(
  nicknameInput: Ref<string>,
  options: {
    mustSelectCollectionAfterLoad: MaybeRef<boolean>;
    mustClearNicknameInputBeforeLoad: MaybeRef<boolean>;
  },
) {
  const toast = usePersonEmotesCollectionLoadToasts();
  const personsEmotesCollectionsStore = usePersonsEmoteCollectionsStore();

  return useAsyncObject(
    async () => {
      const nickname = nicknameInput.value;
      assert.ok(nickname.length, () => toast.panic("emptyInput"));
      if (toValue(options.mustClearNicknameInputBeforeLoad)) {
        nicknameInput.value = "";
      }
      const login = toLowerCase(nickname);
      const collection = await personsEmotesCollectionsStore
        .loadCollection(login)
        .catch((error) => {
          assert.isError(error, FetchError);
          const issueCode = error.data?.data?.issueCode;
          assert.ok(
            typeof issueCode === "string" && issueCode in issueCodeRecord,
          );
          // @ts-expect-error `issueCode in issueCodeRecord is used`, so it's safe
          const failKey = issueCodeRecord[
            issueCode
          ] as keyof typeof issueCodeRecord;
          return toast.panic(failKey) as never;
        });
      toast.success(
        nickname,
        getEmotesIntegrationsStatusAsEmojisString(collection.integrations),
      );
      if (toValue(options.mustSelectCollectionAfterLoad)) {
        personsEmotesCollectionsStore.selectCollection(login);
      }
      return collection;
    },
    { immediate: false },
  );
}
