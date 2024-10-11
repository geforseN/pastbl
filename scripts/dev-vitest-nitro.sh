#!/usr/bin/env bash

if [ -z "$VITEST_SERVER_API_BASE_URL" ]; then
  echo "Error: VITEST_SERVER_API_BASE_URL environment variable is not set."
  exit 1
fi

URL=$VITEST_SERVER_API_BASE_URL

HOST=$(echo "$URL" | awk -F[/:] '{print $4}')
PORT=$(echo "$URL" | awk -F[/:] '{print $5}')

if [ -z "$PORT" ]; then
  echo "Error: Port is not specified in URL."
  exit 1
fi

echo "Parsed host: $HOST"
echo "Parsed port: $PORT"

function cleanup {
  echo "Stopping Nuxt server..."
  kill $NUXT_PID
  exit 1
}

echo "Starting Nuxt server on $HOST:$PORT..."
pnpm exec nuxt dev --host $HOST --port $PORT &
NUXT_PID=$!

pnpm exec wait-on "$URL" --interval 2000 || cleanup

echo "Nuxt server is running, starting Vitest with API base URL: $URL"
pnpm test:server
TEST_EXIT_CODE=$?

echo "Stopping Nuxt server..."
kill $NUXT_PID

if [ $TEST_EXIT_CODE -ne 0 ]; then
  echo "Vitest failed"
  exit $TEST_EXIT_CODE
else
  echo "Vitest finished successfully"
fi
