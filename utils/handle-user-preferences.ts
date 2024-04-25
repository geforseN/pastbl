export function handlePreferences<
  Keys extends string,
  ValidKeys extends Exclude<ExcludeAmpersandInMiddle<Keys>, "none">,
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
