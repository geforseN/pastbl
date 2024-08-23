export function findErrorMessage(reason: unknown, onNotFoundValue: string) {
  if (reason instanceof Error) {
    return reason.message;
  }
  return onNotFoundValue;
}
