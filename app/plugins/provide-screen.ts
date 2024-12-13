import { computed, reactive } from "vue";
import { useBreakpoints, useMediaQuery } from "@vueuse/core";
import { defineNuxtPlugin } from "#app/nuxt";

export default defineNuxtPlugin(() => {
  const isScreenDidBrr = useMediaQuery(
    `(min-width: ${tailwindTheme.screens["go-brr"]})`,
  );
  const breakpoints = useBreakpoints(tailwindTheme.screens);
  const isSmallScreen = breakpoints.smaller("sm");

  return {
    provide: {
      screen: reactive({
        isDidBrr: computed(() => isScreenDidBrr.value),
        isSmall: computed(() => isSmallScreen.value),
      }),
    },
  };
});
