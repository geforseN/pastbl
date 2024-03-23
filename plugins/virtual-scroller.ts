import VueVirtualScroller from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

// app:mounted
export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(VueVirtualScroller);
});
