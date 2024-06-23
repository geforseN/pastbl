export default defineNuxtPlugin(() => {
  const formCollapse = useFormCollapse();
  return {
    provide: {
      formCollapse: reactive(formCollapse),
    },
  };
});
