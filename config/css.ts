export const CHAT_PASTA_LIST_HEIGHT = "50dvh";
export const CHAT_PASTA_LIST_TAILWIND_HEIGHT = "h-[50dvh]";
export const CHAT_PASTA_LIST_GO_BRR_HEIGHT = "60dvh";
export const CHAT_PASTA_LIST_TAILWIND_GO_BRR_HEIGHT = "go-brr:h-[80dvh]";

export const chatPastaList = {
  tailwind: {
    baseHeight: CHAT_PASTA_LIST_HEIGHT,
    goBrrHeight: CHAT_PASTA_LIST_GO_BRR_HEIGHT,
    heights: {
      *[Symbol.iterator]() {
        yield CHAT_PASTA_LIST_TAILWIND_HEIGHT;
        yield CHAT_PASTA_LIST_TAILWIND_GO_BRR_HEIGHT;
      },
    },
  },
} as const;
