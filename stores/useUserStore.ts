import { defineStore } from "pinia";

export const useUserStore = defineStore(
  "user",
  () => {
    const user = ref<{
      nickname: string;
      preferences: {
        nickname: { color: string };
        alerts: {
          copypastaCopy: {
            shouldShowOnSuccess: boolean;
          };
        };
      };
      statistic: { lastCopyPasta?: MegaPasta };
      badges: { count: number };
    }>({
      nickname: "Kappa",
      preferences: {
        nickname: { color: "red" },
        alerts: {
          copypastaCopy: { shouldShowOnSuccess: true },
        },
      },
      badges: { count: 1 },
      statistic: {
        lastCopyPasta: undefined,
      },
    });

    const pastasStore = usePastasStore();

    const preferences = computed(() => user.value.preferences);
    const statistic = computed(() => user.value.statistic);

    watch(
      () => pastasStore.latestPasta,
      (latestPasta) => {
        if (!latestPasta) {
          return console.log("In watch: No latestPasta was found");
        }
        if (
          statistic.value.lastCopyPasta?.createdAt === latestPasta.createdAt
        ) {
          return console.log("In watch: User already persisted latest pasta");
        }
        console.log("In watch: New lastCopyPasta", latestPasta);
        user.value.statistic.lastCopyPasta = latestPasta;
      }
    );

    return { preferences, user, statistic };
  },
  {
    persist: {
      storage: persistedState.localStorage,
      afterRestore(ctx) {
        // NOTE: queueMicrotask is used because without queueMicrotask store has not defined yet
        queueMicrotask(() => {
          const pastasStore = usePastasStore();
          const lastPasta = pastasStore.latestPasta;
          if (!lastPasta) {
            return console.log("User has not created pasta");
          }
          if (
            lastPasta.createdAt ===
            ctx.store.statistic?.lastCopyPasta?.createdAt
          ) {
            return console.log("User already persisted latest pasta");
          }
          console.log("New lastCopyPasta", lastPasta);
          ctx.store.user.statistic.lastCopyPasta = lastPasta;
        });
      },
    },
  }
);
