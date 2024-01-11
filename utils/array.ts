// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export function countAppearances<T extends unknown>(array: T[]) {
  return array.reduce((accumulator, value) => {
    const tagCount = accumulator.get(value) || 0;
    accumulator.set(value, tagCount + 1);
    return accumulator;
  }, new Map<T, number>());
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export function withRemoved<T extends unknown>(
  array: T[],
  cb: (value: T, index: number, array: T[]) => boolean,
) {
  const index = array.findIndex(cb);
  assert.ok(index >= 0);
  return array.toSpliced(index, 1);
}
