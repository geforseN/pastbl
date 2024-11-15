export default defineEventHandler((event) => {
  setTwitchHeaders(event);
  setHeaders(event, {
    "Access-Control-Allow-Headers": "Content-Type",
  });
});
