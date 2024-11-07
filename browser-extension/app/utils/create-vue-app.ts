import { createApp, type Component } from "vue";
import App from "~/components/app.vue";

export function createVueApp(Component: Component = App) {
  const app = createApp(Component);
  app.config.globalProperties.$t = i18n.t.bind(i18n);
  return app;
}

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $t: typeof i18n.t;
  }
}
