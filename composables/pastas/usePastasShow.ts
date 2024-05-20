export type PastaShowStrategy =
  | "all"
  | "selected-user"
  | "only-selected-user"
  | "except-selected-user"
  | "all-selectable-users"
  | "all-without-selectable-users"
  | "none";

export function usePastasShow(
  sortedPastas: Ref<OmegaPasta[]>,
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
    }, new Map<TwitchUserLogin, OmegaPasta[]>()),
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

  const pastasToShowRecord: Record<
    PastaShowStrategy,
    ComputedRef<OmegaPasta[]>
  > = {
    all: computed(() => sortedPastas.value),
    "selected-user": computed(() => selectedUserPastas.value || []),
    "only-selected-user": computed(() => {
      const userPastas = selectedUserPastas.value;
      if (!userPastas) {
        return [];
      }
      return userPastas.filter((pasta) => {
        const tags = pasta.tags.filter(isPastaMentionTagLike);
        return tags.length === 1 && tags[0] === selectedLoginTag.value;
      });
    }),
    "except-selected-user": computed(() => notSelectedUserPastas.value),
    "all-selectable-users": computed(() => [...selectablePastasSet.value]),
    "all-without-selectable-users": computed(() =>
      sortedPastas.value.filter(
        (pasta) => !selectablePastasSet.value.has(pasta),
      ),
    ),
    none: computed(() => []),
  };

  const pastasToShow = computed(
    () => pastasToShowRecord[selectedShowStrategy.state.value].value,
  );

  return {
    selectedShowStrategy: computed({
      get() {
        return selectedShowStrategy.state.value;
      },
      set(value) {
        selectedShowStrategy.state.value = value;
      },
    }),
    pastasToShow,
    usersPastasMap,
    isPersonTagShowStrategySelected: computed(() =>
      ["selected-user", "only-selected-user"].includes(
        selectedShowStrategy.state.value,
      ),
    ),
    isNoPastasToShow: computed(() => pastasToShow.value.length === 0),
  };
}
