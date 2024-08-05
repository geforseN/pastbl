export function useTwitchChannelsSearch(nickname: Ref<string>) {
  const mustShow = ref(false);
  const hide = () => {
    mustShow.value = false;
  };
  const show = () => {
    mustShow.value = true;
  };

  const toast = useMyToast();

  const { data: state } = useFetch("/api/v1/twitch/channels", {
    lazy: true,
    query: { login: nickname },
    default(): ITwitchChannel[] {
      return [];
    },
    onRequest() {
      hide();
      state.value = [];
      assert.ok(nickname.value);
    },
    onResponse: show,
    onResponseError({ response }) {
      const message = JSON.parse(response._data.message)[0].message;
      return toast.throw(new Error(message));
    },
  });

  return {
    state,
    mustShow,
    show,
    hide,
  };
}
