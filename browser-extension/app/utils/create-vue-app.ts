import { createApp } from "vue";
import App from "~/components/app.vue";

export function createVueApp() {
  const app = createApp(App);
  app.config.globalProperties.$t = i18n.t.bind(i18n);
  return app;
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $t: typeof i18n.t;
  }
}
