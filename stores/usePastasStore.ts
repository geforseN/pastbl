import { defineStore } from "pinia";
import { pastasService } from "~/client-only/services";

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
  const pastasSortStrategies = {
    "newest-first": computed(() =>
      allPastas.value.toSorted((a, b) => b.createdAt - a.createdAt),
    ),
    "oldest-first": computed(() =>
      allPastas.value.toSorted((a, b) => a.createdAt - b.createdAt),
    ),
    "last-updated": computed(() =>
      allPastas.value.toSorted(
        (a, b) => (b.updatedAt || 0) - (a.updatedAt || 0),
      ),
    ),
    "last-copied": computed(() =>
      allPastas.value.toSorted(
        /* FIXME: sorting is done incorrectly */
        (a, b) => (b.lastCopiedAt || 0) - (a.lastCopiedAt || 0),
      ),
    ),
  };
  const sortedPastas = computed(
    () => pastasSortStrategies[selectedSortStrategy.state.value].value,
  );

  return {
    selectedSortStrategy: computed({
      get() {
        return selectedSortStrategy.state.value;
      },
      set(value) {
        selectedSortStrategy.state.value = value;
      },
    }),
    sortedPastas,
  };
}

export type PastaShowStrategy =
  | "all"
  | "selected-user"
  | "only-selected-user"
  | "except-selected-user"
  | "all-selectable-users"
  | "all-without-selectable-users";

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
      const loginsMentioned = pasta.tags.filter((tag) => tag.startsWith("@"));
      for (const tag of loginsMentioned) {
        const login = tag.replace("@", "");
        assert.ok(login === toLowerCase(login));
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

  const pastasToShow = {
    all: computed(() => sortedPastas.value),
    "selected-user": computed(() => {
      const userPastas = usersPastasMap.value.get(selectedLogin.value);
      if (!userPastas) {
        return [];
      }
      return userPastas;
    }),
    "only-selected-user": computed(() => {
      const userPastas = usersPastasMap.value.get(selectedLogin.value);
      if (!userPastas) {
        return [];
      }
      return userPastas.filter((pasta) => {
        const loginsTags = pasta.tags.filter((tag) => tag.startsWith("@"));
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
      if (typeof window === "undefined") {
        return [];
      }
      const pastas = await pastasService.getAll();
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
    computed(() => useUserCollectionsStore().selectedCollectionLogin.state),
  );
  const canShowPastas = computedAsync(async () => {
    await Promise.all([
      until(() => useEmotesStore().isInitialUserEmotesReady).toBe(true),
      until(pastas.isReady).toBe(true, { timeout: 3_500 }),
    ]);
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
      pastas.state.value,
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
      Math.min(...pastasTextLength.value),
    ),
    maxPastaTextLengthInPastas: computed(() =>
      Math.max(...pastasTextLength.value),
    ),
    async createPasta(
      basePasta: BasePasta,
      options: { onEnd?: () => MaybePromise<void> } = {},
    ) {
      const m = "toast.createPasta.";
      const trimmedText = megaTrim(basePasta.text);
      const lengthStatus = getLengthStatus(trimmedText.length, pastaTextLength);
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
        const tags = toRaw(basePasta.tags);
        const megaPasta = createMegaPasta(trimmedText, tags);
        const megaPastaWithId = await pastasService
          .add(megaPasta)
          .catch((reason) => {
            const message =
              reason instanceof Error
                ? reason.message
                : t(m + "fail.genericFailMessage");
            throw new ExtendedError(message, {
              title: t(m + "fail.title"),
            });
          });
        pastas.state.value = [...pastas.state.value, megaPastaWithId];
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
      await pastasService.moveFromListToBin(pasta);
      pastas.state.value = pastas.state.value.toSpliced(index, 1);
      const ms = "toast.removePasta.success.";
      toast.add(
        new RemovePastaNotification({
          title: t(ms + "title"),
          description: t(ms + "message"),
          undo: {
            label: t(ms + "undoLabel"),
            async click() {
              await pastasService.moveFromBinToList(pasta);
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
        const newPasta = await pastasService.patchLastCopied(toRaw(pasta));
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
      await pastasService.put(pasta);
      pastas.state.value = pastas.state.value.with(index, pasta);
      toast.add({
        description: t(m + "success.message"),
        title: t(m + "success.title"),
        timeout: 7_000,
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
