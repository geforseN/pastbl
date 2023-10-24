export default <K extends string, V>(map: ReadonlyMap<K, V>) => {
  return [...map].reduce(
    (record, [key, value]) => {
      record[key] = value;
      return record;
    },
    {} as Record<K, V>,
  );
};
