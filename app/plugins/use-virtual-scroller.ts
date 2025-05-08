// @ts-expect-error no type definition for VueVirtualScroller were found
import VueVirtualScroller from "vue-virtual-scroller";
import { defineNuxtPlugin } from "#app/nuxt";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(VueVirtualScroller);
});
