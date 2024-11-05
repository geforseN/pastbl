export class ServiceNotAvailableError extends Error {
  constructor() {
    super("Service not available");
  }
}

export function isServiceNotAvailableError(
  error: unknown,
): error is ServiceNotAvailableError {
  return error instanceof ServiceNotAvailableError;
}
