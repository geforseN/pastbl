export function useChannelsSearch(nickname: Ref<string>) {
  const mustShow = ref(false);
  const hide = () => {
    mustShow.value = false;
  };
  const show = () => {
    mustShow.value = true;
  };

  const { data: state } = useFetch("/api/v1/twitch/search/channels", {
    lazy: true,
    query: { login: nickname },
    default(): Channel[] {
      return [];
    },
    onRequest() {
      hide();
      state.value = [];
      assert.ok(nickname.value);
    },
    onResponse: show,
  });

  return {
    state,
    mustShow,
    show,
    hide,
  };
}
