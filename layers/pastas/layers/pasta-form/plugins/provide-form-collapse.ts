import { reactive } from "vue";
import { usePastaFormCollapse } from "../composables/usePastaFormCollapse";
import { defineNuxtPlugin } from "#app/nuxt";

export default defineNuxtPlugin(() => {
  const formCollapse = usePastaFormCollapse();
  return {
    provide: {
      formCollapse: reactive(formCollapse),
    },
  };
});
