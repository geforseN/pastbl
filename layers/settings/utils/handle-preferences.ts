type ExcludeNotJoinedWithAmpersand<S extends string> =
  S extends `${string}&${string}` ? never : S;

export function handlePreferences<
  Keys extends string,
  ValidKeys extends Exclude<ExcludeNotJoinedWithAmpersand<Keys>, "none">,
>(
  preferenceRef: Ref<Keys>,
  handlers: Record<ValidKeys, () => MaybePromise<void>>,
) {
  const preference = preferenceRef.value;
  if (preference === "none") {
    return;
  }
  for (const action of preference.split("&")) {
    handlers[action as ValidKeys]();
  }
}
