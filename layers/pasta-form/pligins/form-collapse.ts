export default defineNuxtPlugin(() => {
  const formCollapse = usePastaFormCollapse();
  return {
    provide: {
      formCollapse: reactive(formCollapse),
    },
  };
});
