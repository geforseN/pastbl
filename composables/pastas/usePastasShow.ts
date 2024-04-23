export type PastaShowStrategy =
  | "all"
  | "selected-user"
  | "only-selected-user"
  | "except-selected-user"
  | "all-selectable-users"
  | "all-without-selectable-users"
  | "none";

export function usePastasShow(
  sortedPastas: Ref<IDBMegaPasta[]>,
  selectedLogin: Ref<SelectableLogin>,
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