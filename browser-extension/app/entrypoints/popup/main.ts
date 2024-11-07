import { createVueApp } from "~/utils/create-vue-app";
import SettingsModal from "~/components/settings/settings-modal.vue";
import "~/assets/index.css";

createVueApp(SettingsModal).mount("#app");
