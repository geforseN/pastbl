import screens from "#tailwind-config/theme/screens";

export default defineNuxtPlugin(() => {
  const isScreenDidBrr = useMediaQuery(`(min-width: ${screens["go-brr"]})`);
  return {
    provide: {
      screen: reactive({
        isDidBrr: isScreenDidBrr.value,
      }),
    },
  };
});
