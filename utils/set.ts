export function setIntersection<T>(...sets: Set<T>[]) {
  const result = new Set<T>();
  if (sets.length === 0) {
    return result;
  }
  if (sets.length === 2) {
    return setIntersectionOfTwoSets(sets[0], sets[1]);
  }
  const smallestSet = sets.reduce((min, set) => {
    if (set.size < min.size) {
      return set;
    }
    return min;
  });
  const otherSets = sets.toSpliced(sets.indexOf(smallestSet), 1);
  for (const value of smallestSet) {
    if (otherSets.every((set) => set.has(value))) {
      result.add(value);
    }
  }
  return result;
}

function getMinMaxOfTwoSets<T>(firstSet: Set<T>, secondSet: Set<T>) {
  const minSet = firstSet.size < secondSet.size ? firstSet : secondSet;
  const maxSet = minSet === firstSet ? secondSet : firstSet;
  return { minSet, maxSet };
}

function setIntersectionOfTwoSets<T>(firstSet: Set<T>, secondSet: Set<T>) {
  const result = new Set<T>();
  const { minSet, maxSet } = getMinMaxOfTwoSets(firstSet, secondSet);
  for (const value of minSet) {
    if (maxSet.has(value)) {
      result.add(value);
    }
  }
  return result;
}

export function setDifferenceOtTwoSets<T>(firstSet: Set<T>, secondSet: Set<T>) {
  const result = new Set<T>();
  const { minSet, maxSet } = getMinMaxOfTwoSets(firstSet, secondSet);
  for (const value of minSet) {
    if (!maxSet.has(value)) {
      result.add(value);
    }
  }
  return result;
}
