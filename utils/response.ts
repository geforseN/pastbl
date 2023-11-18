export function assertResponse(
  response: Response,
  messageOrError: string | Error = Error(
    `HTTP error, status = ${response.status} error: ${response.text()}`,
  ),
) {
  if (!response.ok) {
    throw messageOrError instanceof Error
      ? (messageOrError as Error)
      : new Error(messageOrError as string);
  }
}
