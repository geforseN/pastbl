// import screens from "#tailwind-config/theme/screens";

export default defineNuxtPlugin(() => {
  const isScreenDidBrr = useMediaQuery(`(min-width: 890px)`);
  return {
    provide: {
      screen: reactive({
        isDidBrr: isScreenDidBrr.value,
      }),
    },
  };
});
