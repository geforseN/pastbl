export const pastasConfig = {
  pastaTag: {
    length: { min: 1, max: 128 },
  },
  pastaTags: {
    count: { min: 0, max: 10 },
  },
  pastaText: {
    length: { min: 1, warning: 500, max: 1984 },
  },
  pastaList: {
    heights: ["h-[50dvh] go-brr:h-[80dvh]"],
  },
} as const;
