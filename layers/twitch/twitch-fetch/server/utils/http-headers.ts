export function setTwitchHeaders(event: H3Event) {
  setHeaders(event, {
    "Access-Control-Allow-Origin": "https://www.twitch.tv",
    "Access-Control-Allow-Credentials": "true",
  });
}
