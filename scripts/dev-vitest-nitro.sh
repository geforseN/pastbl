#!/usr/bin/env bash

# Проверка наличия переменных окружения
if [ -z "$HOST" ]; then
  echo "Error: HOST environment variable is not set. Allowed values: 'localhost' or '127.0.0.1'."
  exit 1
fi

if [ -z "$PORT" ]; then
  echo "Error: PORT environment variable is not set. Allowed values: 1024-65535."
  exit 1
fi

# Проверка допустимых значений для HOST
if [[ "$HOST" != "localhost" && "$HOST" != "127.0.0.1" ]]; then
  echo "Error: Invalid HOST value. Allowed values: 'localhost' or '127.0.0.1'."
  exit 1
fi

# Проверка допустимого диапазона значений для PORT
if ! [[ "$PORT" =~ ^[0-9]+$ ]] || [ "$PORT" -lt 1024 ] || [ "$PORT" -gt 65535 ]; then
  echo "Error: Invalid PORT value. Allowed values: 1024-65535."
  exit 1
fi

echo "Using host: $HOST"
echo "Using port: $PORT"

function cleanup {
  echo "Stopping Nuxt server..."
  kill $NUXT_PID
  exit 1
}

echo "Starting Nuxt server on $HOST:$PORT..."
pnpm exec nuxt dev --host $HOST --port $PORT &
NUXT_PID=$!

pnpm exec wait-on "http://$HOST:$PORT" --interval 2000 || cleanup

echo "Nuxt server is running, starting Vitest with API base URL: http://$HOST:$PORT"
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
