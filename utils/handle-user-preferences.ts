type StringWithoutAmpersand<S extends string> = S extends `${infer T}${infer U}`
  ? T extends "&"
    ? never
    : U extends "&"
      ? never
      : string
  : never;

export function handlePreferences<
  K extends string,
  PK extends StringWithoutAmpersand<K>,
>(
  handlers: Record<Exclude<PK, "none">, () => MaybePromise<void>>,
  preferenceRef: Ref<K>,
) {
  const preference = preferenceRef.value;
  if (preference === "none") {
    return;
  }
  for (const action of preference.split("&")) {
    handlers[action as Exclude<PK, "none">]();
  }
}
