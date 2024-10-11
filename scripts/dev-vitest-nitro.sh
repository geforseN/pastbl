#!/usr/bin/env bash

# Подключение файла с функциями
source ./scripts/_check_env_var.sh

# Проверка переменных окружения
check_host_var "HOST" "$HOST" "localhost|127.0.0.1"
check_port_var "PORT" "$PORT" 1024 65535

echo "Using host: $HOST"
echo "Using port: $PORT"

function cleanup {
  echo "Stopping Nuxt server..."
  kill $NUXT_PID
  exit 1
}

echo "Starting Nuxt server on $HOST:$PORT..."
pnpm exec nuxt dev --host "$HOST" --port "$PORT" &
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
