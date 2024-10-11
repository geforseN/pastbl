#!/usr/bin/env bash

source ./scripts/_check_env_var.sh

[ -n "$TWITCH_APP_CLIENT_SECRET" ] || { echo "TWITCH_APP_CLIENT_SECRET is empty" 1>&2; exit 1; }
[ -n "$TWITCH_APP_CLIENT_ID" ] || { echo "TWITCH_APP_CLIENT_ID is empty" 1>&2; exit 1; }

check_host_var "HOST" "$HOST" "localhost|127.0.0.1"
check_port_var "PORT" "$PORT" 1024 65535

echo "Using host: $HOST"
echo "Using port: $PORT"

URL="http://$HOST:$PORT"

cleanup() {
  local message="$1"
  local exit_code=${2:-0}
  # Redirecting to stderr if exit_code is not equal to 0
  echo "$message" >&$((exit_code != 0 ? 2 : 1))
  [ -n "$NUXT_PID" ] && { 
    echo "Stopping Nuxt server..."; 
    kill "$NUXT_PID";
  }
  exit "$exit_code"
}

echo "Starting Nuxt server on $HOST:$PORT..."

TWITCH_APP_CLIENT_SECRET="$TWITCH_APP_CLIENT_SECRET" \
TWITCH_APP_CLIENT_ID="$TWITCH_APP_CLIENT_ID" \
pnpm exec nuxt dev --host "$HOST" --port "$PORT" & NUXT_PID=$!

pnpm exec wait-on "$URL" --interval 2000 || cleanup "Error: Nuxt server did not start in time." 1

echo "Nuxt server is running, starting Vitest on $URL"

VITEST_SERVER_API_BASE_URL="$URL" \
pnpm test:nitro

[ $? -ne 0 ] && cleanup "Vitest failed" $? || cleanup "Vitest finished successfully"

