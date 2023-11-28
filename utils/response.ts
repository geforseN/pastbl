export function assertResponse(
  response: Response,
  messageOrError: string | Error = Error(
    `HTTP error, status = ${response.status} error: ${response.text()}`,
  ),
) {
  if (response.ok) {
    return;
  }
  if (messageOrError instanceof Error) {
    throw messageOrError;
  }
  throw new Error(messageOrError);
}
