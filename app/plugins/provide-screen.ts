export default defineNuxtPlugin(() => {
  const isScreenDidBrr = useMediaQuery(
    `(min-width: ${tailwindTheme.screens["go-brr"]})`,
  );
  return {
    provide: {
      screen: reactive({
        isDidBrr: computed(() => isScreenDidBrr.value),
      }),
    },
  };
});
