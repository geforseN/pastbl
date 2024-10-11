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
  if [ -n "$NUXT_PID" ]; then
    echo "Stopping Nuxt server..."
    kill "$NUXT_PID"
  fi
  exit 1
}

echo "Starting Nuxt server on $HOST:$PORT..."
pnpm exec nuxt dev --host "$HOST" --port "$PORT" & NUXT_PID=$!

pnpm exec wait-on "$URL" --interval 2000 || { 
  echo "Error: Nuxt server did not start in time."; 
  cleanup; 
}

echo "Nuxt server is running, starting Vitest on $URL"

VITEST_SERVER_API_BASE_URL="$URL" \
TWITCH_APP_CLIENT_SECRET="$TWITCH_APP_CLIENT_SECRET" \   
TWITCH_APP_CLIENT_ID="$TWITCH_APP_CLIENT_ID" \
pnpm test:nitro

echo "Vitest $( [ $? -ne 0 ] && echo "failed" || echo "finished successfully" )"

cleanup
