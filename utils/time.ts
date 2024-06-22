export function isToday(date: Date | number | string) {
  const today = new Date().toISOString().slice(0, 10);
  return new Date(date).toISOString().slice(0, 10) === today;
}

export function dayDifference(date1: Date, date2: Date) {
  const msDiff = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(msDiff / (1_000 * 60 * 60 * 24));
}

export function toDateCompactISO(value: ConstructorParameters<typeof Date>[0]) {
  return new Date(value).toISOString().slice(0, 16);
}
