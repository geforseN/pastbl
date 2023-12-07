import { defineStore } from "pinia";

type User = {
  nickname: string;
  preferences: {
    nickname: {
      // NOTE: color must be HEX format (# and 6 digits)
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

// TODO debounce all values, main thread is blocked by many read/writes by localStorage
// TODO persist all values in idb
export const useUserStore = defineStore(
  "user",
  () => {
    const nicknameColor = ref("#CC0000");
    // debounce us useful because this storage uses localStorage persist
    // because of persist usage main thread was significantly blocked when color was not throttled

    watchThrottled(
      nicknameColor,
      (color) => {
        user.value.preferences.nickname.color = color;
      },
      {
        throttle: 500,
      },
    );

    const user = ref<User>({
      nickname: "Kappa",
      preferences: {
        nickname: { color: "#CC0000" },
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

    watchOnce(
      () => user.value.preferences.nickname.color,
      (color) => {
        nicknameColor.value = color;
      },
      { flush: "sync" },
    );

    const preferences = computed(() => user.value.preferences);

    return { preferences, user, nicknameColor };
  },
  {
    persist: {
      storage: persistedState.localStorage,
      debug: true,
      paths: ["user"],
    },
  },
);
