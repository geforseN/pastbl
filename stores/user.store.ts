import { defineStore } from "pinia";

export const useUserStore = defineStore(
  "user",
  () => {
    const preferences = reactive<{ nickname: { color: string } }>({
      nickname: { color: "red" },
    });
    const user = ref({ nickname: "", preferences, badges: { count: 1 } });

    return { preferences, user };
  },
  { persist: true }
);
