import { createApp as createVueApp } from "vue";
import App from "~/components/app.vue";

export function createApp() {
  const app = createVueApp(App);
  app.config.globalProperties.$t = i18n.t.bind(i18n);
  return app;
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $t: typeof i18n.t;
  }
}
