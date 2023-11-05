import { defineStore } from "pinia";

type User = {
  nickname: string;
  preferences: {
    nickname: {
      // NOTE: color must be HEX format
      color: string;
    };
    alerts: {
      copypastaCopy: {
        mustShowOnSuccess: boolean;
      };
    };
    sounds: {
      copypastaCopy: {
        mustSoundOnSuccess: boolean;
      };
    };
  };
  badges: { count: number };
};

export const useUserStore = defineStore(
  "user",
  () => {
    const user = ref<User>({
      nickname: "Kappa",
      preferences: {
        nickname: { color: "#C00" },
        alerts: {
          copypastaCopy: {
            mustShowOnSuccess: true,
          },
        },
        sounds: {
          copypastaCopy: {
            mustSoundOnSuccess: true,
          },
        },
      },
      badges: { count: 1 },
    });

    const preferences = computed(() => user.value.preferences);

    return { preferences, user };
  },
  {
    persist: {
      storage: persistedState.localStorage,
      debug: true,
    },
  },
);
