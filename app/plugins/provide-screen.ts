import { goBrrScreenSize } from "~~/tailwind.config";

export default defineNuxtPlugin(() => {
  const isScreenDidBrr = useMediaQuery(`(min-width: ${goBrrScreenSize})`);
  return {
    provide: {
      screen: reactive({
        isDidBrr: isScreenDidBrr.value,
      }),
    },
  };
});
