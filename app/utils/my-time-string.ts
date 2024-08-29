export type MyTimeStringFormat = "m" | "h" | "d";
export type MyTimeString = `${number}${MyTimeStringFormat}`;

const myTimeStringFormatMultipliers: Record<MyTimeStringFormat, number> = {
  m: 1000,
  h: 60 * 1000,
  d: 24 * 60 * 1000,
};

function getMyTimeStringFormatMultiplier(
  format: MyTimeStringFormat | string | undefined,
) {
  return (
    myTimeStringFormatMultipliers[format as MyTimeStringFormat] ||
    assert.fail(`Unknown myTimeString format=${format}`)
  );
}

export function formatMyTimeStringToMilliseconds(myTimeString: MyTimeString) {
  const int = parseInt(myTimeString, 10);
  assert.ok(Number.isInteger(int));
  const format = myTimeString.at(-1);
  const multiplier = getMyTimeStringFormatMultiplier(format);
  return int * multiplier;
}
