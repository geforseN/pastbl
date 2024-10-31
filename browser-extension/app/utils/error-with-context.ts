export class ErrorWithContext extends Error {
  constructor(message: string, public context: Record<string, unknown>) {
    super(message);
  }
}
