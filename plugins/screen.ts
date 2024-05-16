import { theme } from "#tailwind-config";

export default defineNuxtPlugin(() => {
  const isScreenDidBrr = useMediaQuery(
    `(min-width: ${theme.screens["go-brr"]})`,
  );
  return {
    provide: {
      screen: reactive({
        isDidBrr: isScreenDidBrr.value,
      }),
    },
  };
});
