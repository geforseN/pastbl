import { createApp } from "vue";
import "./src/index.css";

import Playground from "./playground.vue";

const app = createApp(Playground);
app.mount("#app");
