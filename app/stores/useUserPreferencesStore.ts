async function playClickSound() {
  await new Audio("/sounds/click.wav").play();
}

export const useUserPreferencesStore = defineStore("user-preferences", () => {
  const copyPastaToasts = useCopyPastaToasts();
  const copyTextToasts = useCopyTextToasts();

  const userStore = useUserStore();

  const onPastaCopy = computed(() => userStore.user.pasta.oncopy.state);

  const preferences = {
    onPastaTextCopy: () =>
      handlePreferences(onPastaCopy, {
        alert() {
          copyPastaToasts.success();
        },
        sound: playClickSound,
      }),
    onTextCopy: () =>
      handlePreferences(onPastaCopy, {
        alert() {
          copyTextToasts.success();
        },
        sound: playClickSound,
      }),
  };

  return {
    preferences,
  };
});
