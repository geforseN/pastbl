import { defineStore } from "pinia";

export const useUserStore = defineStore(
  "user",
  () => {
    const preferences = reactive<Record<string, never>>({});
    const user = ref({ nickname: "" });

    return { preferences, user };
  },
  { persist: true }
);
