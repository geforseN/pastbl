export class NotAuthorizedError extends Error {
  constructor() {
    super("Not authorized");
  }
}

export const isNotAuthorizedError = (
  error: unknown,
): error is NotAuthorizedError => error instanceof NotAuthorizedError;
