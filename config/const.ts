export const pastaTagLength = {
  min: 1,
  max: 128,
} as const;

export const pastaTagsCount = {
  min: 0,
  max: 10,
} as const;

export const pastaTextLength = {
  min: 1,
  max: 1984,
  warning: 500,
} as const;

export const badgesCount = {
  min: 0,
  max: 10,
} as const;

export const nicknameLength = {
  min: 3,
  max: 32,
};

export const config = {
  pastaTagLength,
  pastaTagsCount,
  pastaTextLength,
  badgesCount,
  nicknameLength,
} as const;
