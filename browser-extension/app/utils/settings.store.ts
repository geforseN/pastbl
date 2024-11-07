import { watchThrottled } from "@vueuse/core";
import { storage } from "wxt/storage";

const KEY = "local:main-button-styles";

// NOTE: color related properties must
// - first character must be '#'
// - other 6 characters must be hex value (from 0 to 9 and a to f)
export const $mainButtonStyles = reactive({
  color: "#ea580c",
  backgroundColor: "#ffffff",
  borderColor: "#ea580c",
});

storage
  .getItem<typeof $mainButtonStyles>(KEY)
  .then((value) => {
    if (value) {
      Object.assign($mainButtonStyles, value);
    }
  });

watchThrottled($mainButtonStyles, async (mainButtonStyles) => {
  await storage.setItem(KEY, mainButtonStyles);
}, {
  throttle: 500,
});

storage.watch<typeof $mainButtonStyles>(KEY, (mainButtonStyles) => {
  Object.assign($mainButtonStyles, mainButtonStyles);
});
