export default function returnResponseJSON(response: Response) {
  if (!response.ok) {
    throw new Error(
      `HTTP error, status = ${response.status} error: ${response.text()}`,
    );
  }
  return response.json();
}
