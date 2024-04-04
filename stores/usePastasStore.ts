import { defineStore } from "pinia";
import { pastasIdbService } from "~/client-only/services";
import { pastaTextLength } from "~/config/const";

export type PastaSortStrategy =
  | "newest-first"
  | "oldest-first"
  | "last-updated"
  | "last-copied";

function usePastasSort(allPastas: Ref<IDBMegaPasta[]>) {
  const selectedSortStrategy = useIndexedDBKeyValue(
    "pasta-list:sort-strategy",
    "newest-first",
  );
  const sortedPastas = {
    "newest-first": computed(() =>
      allPastas.value.toSorted((a, b) => b.createdAt - a.createdAt),
    ),
    "oldest-first": computed(() =>
      allPastas.value.toSorted((a, b) => a.createdAt - b.createdAt),
    ),
    "last-updated": computed(() =>
      allPastas.value.toSorted(
        (a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt),
      ),
    ),
    "last-copied": computed(() =>
      allPastas.value.toSorted((a, b) => {
        if (a.lastCopiedAt && b.lastCopiedAt) {
          return b.lastCopiedAt - a.lastCopiedAt;
        }
        const isOnlyOneHasLastCopied = !a.lastCopiedAt !== !b.lastCopiedAt;
        if (isOnlyOneHasLastCopied) {
          return a.lastCopiedAt ? -1 : 1;
        }
        return (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt);
      }),
    ),
  } satisfies Record<PastaSortStrategy, ComputedRef<IDBMegaPasta[]>>;

  return {
    selectedSortStrategy: computed({
      get() {
        return selectedSortStrategy.state.value;
      },
      set(value) {
        selectedSortStrategy.state.value = value;
      },
    }),
    sortedPastas: computed(
      () => sortedPastas[selectedSortStrategy.state.value].value,
    ),
  };
}

export type PastaShowStrategy =
  | "all"
  | "selected-user"
  | "only-selected-user"
  | "except-selected-user"
  | "all-selectable-users"
  | "all-without-selectable-users"
  | "none";

function usePastasShow(
  sortedPastas: Ref<IDBMegaPasta[]>,
  selectedLogin: Ref<Lowercase<string> | "">,
) {
  const selectedShowStrategy = useIndexedDBKeyValue(
    "pasta-list:show-strategy",
    "all",
  );

  const selectedLoginTag = computed(() => `@${selectedLogin.value}`);

  const usersPastasMap = computed(() =>
    sortedPastas.value.reduce((map, pasta) => {
      const loginsMentioned = pasta.tags.filter(isPastaMentionTagLike);
      for (const tag of loginsMentioned) {
        const login = parseLoginFromPastaMentionTag(tag);
        assert.ok(isLowercase(login));
        if (map.has(login)) {
          map.get(login)!.push(pasta);
        } else {
          map.set(login, [pasta]);
        }
      }
      return map;
    }, new Map<Lowercase<string>, IDBMegaPasta[]>()),
  );

  const notSelectedUserPastas = computed(() => {
    if (!selectedLogin.value) {
      return sortedPastas.value;
    }
    return sortedPastas.value.filter(
      (pasta) => !pasta.tags.includes(selectedLoginTag.value),
    );
  });

  const selectablePastasSet = computed(() => {
    const pastas = [...usersPastasMap.value.values()].flat();
    return new Set(pastas);
  });

  const selectedUserPastas = computed(() =>
    usersPastasMap.value.get(selectedLogin.value),
  );

  const pastasToShow = {
    all: computed(() => sortedPastas.value),
    "selected-user": computed(() => selectedUserPastas.value || []),
    "only-selected-user": computed(() => {
      const userPastas = selectedUserPastas.value;
      if (!userPastas) {
        return [];
      }
      return userPastas.filter((pasta) => {
        const loginsTags = pasta.tags.filter(isPastaMentionTagLike);
        return (
          loginsTags.length === 1 && loginsTags[0] === selectedLoginTag.value
        );
      });
    }),
    "except-selected-user": computed(() => notSelectedUserPastas.value),
    "all-selectable-users": computed(() => {
      return [...selectablePastasSet.value];
    }),
    "all-without-selectable-users": computed(() => {
      return sortedPastas.value.filter(
        (pasta) => !selectablePastasSet.value.has(pasta),
      );
    }),
    none: computed(() => []),
  } satisfies Record<PastaShowStrategy, ComputedRef<IDBMegaPasta[]>>;

  return {
    selectedShowStrategy: computed({
      get() {
        return selectedShowStrategy.state.value;
      },
      set(value) {
        selectedShowStrategy.state.value = value;
      },
    }),
    pastasToShow: computed(
      () => pastasToShow[selectedShowStrategy.state.value].value,
    ),
    usersPastasMap,
  };
}

export const usePastasStore = defineStore("pastas", () => {
  const pastas = useAsyncState(
    async () => {
      if (process.server) {
        return [];
      }
      const pastas = await pastasIdbService.getAll();
      return pastas;
    },
    [],
    { shallow: true, throwError: true },
  );
  const toast = useNuxtToast();
  const { t } = useI18n();

  const { selectedSortStrategy, sortedPastas } = usePastasSort(pastas.state);
  const { selectedShowStrategy, pastasToShow, usersPastasMap } = usePastasShow(
    sortedPastas,
    computed(() => useUserCollectionsStore().selectedLogin.state),
  );
  const canShowPastas = computedAsync(async () => {
    await Promise.all([
      until(() => useEmotesStore().canUseUserEmotes).toBe(true),
      until(pastas.isReady).toBe(true, { timeout: 3_500 }),
    ]).catch(() => {});
    return true;
  }, false);

  async function triggerRerender() {
    canShowPastas.value = false;
    await nextTick();
    canShowPastas.value = true;
  }

  function getPastaIndexById(id: number) {
    const m = "toast.getPastaIndexById.fail.";
    return getValidIndex(
      pastas.state,
      (pasta_) => pasta_.id === id,
      new ExtendedError(t(m + "message"), {
        title: t(m + "title"),
      }),
    );
  }

  const pastasTextLength = computed(() =>
    pastas.state.value.map((pasta) => pasta.text.length),
  );

  return {
    triggerRerender,
    getPastaById(id: number) {
      const index = getPastaIndexById(id);
      return pastas.state.value[index];
    },
    canShowPastas,
    pastasToShow,
    usersPastasMap,
    selectedShowStrategy,
    selectedSortStrategy,
    pastas,
    sortedPastas,
    mostPopularTagsEntries: computed(() => {
      const allTags = pastas.state.value.flatMap((pasta) => pasta.tags);
      return Array.from(countAppearances(allTags)).sort(
        ([, aCount], [, bCount]) => bCount - aCount,
      );
    }),
    minPastaTextLengthInPastas: computed(() =>
      pastasTextLength.value.length ? Math.min(...pastasTextLength.value) : 0,
    ),
    maxPastaTextLengthInPastas: computed(() =>
      pastasTextLength.value.length ? Math.max(...pastasTextLength.value) : 0,
    ),
    async createPasta(
      basePasta: BasePasta,
      options: { onEnd?: () => MaybePromise<void> } = {},
    ) {
      const m = "toast.createPasta.";
      const trimmedText = megaTrim(basePasta.text);
      const lengthStatus = getPastaLengthStatus(trimmedText);
      try {
        assert.ok(
          lengthStatus === "ok",
          new ExtendedError(
            t(m + `fail.${lengthStatus}Message`, pastaTextLength),
            {
              title: t(m + "fail.title"),
            },
          ),
        );
        const megaPasta = makeMegaPasta(trimmedText, basePasta.tags);
        const megaPastaWithId = await pastasIdbService
          .add(megaPasta)
          .catch((reason) => {
            const message = isError(reason)
              ? reason.message
              : t(m + "fail.genericFailMessage");
            throw new ExtendedError(message, {
              title: t(m + "fail.title"),
            });
          });
        pastas.state.value = [...pastas.state.value, megaPastaWithId];
        // pushToast('pastaAdded')
        toast.add({ title: t(m + "success.title") });
        await options.onEnd?.();
      } catch (error) {
        assert.isError(error, ExtendedError);
        toast.add(error);
        throw error;
      }
    },
    async removePasta(pasta: IDBMegaPasta) {
      const index = getPastaIndexById(pasta.id);
      await pastasIdbService.moveFromListToBin(pasta);
      pastas.state.value = pastas.state.value.toSpliced(index, 1);
      const ms = "toast.removePasta.success.";
      toast.add(
        new RemovePastaNotification({
          title: t(ms + "title"),
          description: t(ms + "message"),
          undo: {
            label: t(ms + "undoLabel"),
            async click() {
              await pastasIdbService.moveFromBinToList(pasta);
              pastas.state.value = pastas.state.value.toSpliced(
                index,
                0,
                pasta,
              );
            },
          },
        }),
      );
    },
    async patchPatchLastCopied(pasta: IDBMegaPasta) {
      try {
        const newPasta = await pastasIdbService.patchLastCopied(toRaw(pasta));
        pastas.state.value = pastas.state.value.with(
          getPastaIndexById(pasta.id),
          newPasta,
        );
      } catch (reason) {
        assert.ok(reason instanceof Error, "Pasta state update failed");
        const m = "toast.patchPatchLastCopied.fail.";
        toast.add({
          description: t(m + "message"),
          title: t(m + "title"),
          timeout: 7_000,
          color: "red",
        });
        throw reason;
      }
    },
    async putPasta(pasta: IDBMegaPasta) {
      const m = "toast.putPasta.";
      let index = -1;
      try {
        index = getPastaIndexById(pasta.id);
        const oldPasta = pastas.state.value[index];
        assert.ok(
          oldPasta.text !== pasta.text ||
            oldPasta.tags.toString() !== pasta.tags.toString(),
          new ExtendedError(t(m + "fail.message"), {
            title: t(m + "fail.title"),
          }),
        );
      } catch (error) {
        assert.isError(error, ExtendedError);
        toast.add(error);
        return;
      }
      await pastasIdbService.put(pasta);
      pastas.state.value = pastas.state.value.with(index, pasta);
      toast.add({
        description: t(m + "success.message"),
        title: t(m + "success.title"),
        timeout: 3_000,
        color: "green",
      });
    },
  };
});

class RemovePastaNotification {
  title: string;
  color: import("@nuxt/ui/dist/runtime/types").NotificationColor;
  timeout: number;
  actions: import("@nuxt/ui/dist/runtime/types").NotificationAction[];
  description: string;

  constructor({
    title,
    description,
    undo,
  }: {
    title: string;
    description: string;
    undo: {
      label: string;
      click: () => void;
    };
  }) {
    this.timeout = 7_000;
    this.color = "yellow";
    this.title = title;
    this.description = description;
    this.actions = [
      {
        color: "green",
        label: undo.label,
        block: true,
        size: "md",
        click: undo.click,
      },
    ];
  }
}

class PastaText {
  previous?: string;
  current: string;

  constructor(text: string) {
    this.current = text;
  }

  update(text: string) {
    this.previous = this.current;
    this.current = text;
  }
}

class Pasta {
  #validTokens;
  #prevText?: string;
  text: string;
  // OR
  #text;

  constructor({ validTokens, text }) {
    this.#validTokens = validTokens;
    this.text = text;
    // OR
    this.#text = new PastaText(text);
  }

  get validTokens() {
    if (!this.#prevText) {
      return this.#validTokens;
    }
  }

  refresh({ text }) {
    this.#prevText = this.text;
    this.text = text;
  }
}
