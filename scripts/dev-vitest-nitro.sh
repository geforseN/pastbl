#!/usr/bin/env bash

source ./scripts/_check_env_var.sh

check_host_var "HOST" "$HOST" "localhost|127.0.0.1"
check_port_var "PORT" "$PORT" 1024 65535

echo "Using host: $HOST"
echo "Using port: $PORT"

cleanup() {
  echo "Stopping Nuxt server..."
  kill $NUXT_PID
}

echo "Starting Nuxt server on $HOST:$PORT..."
pnpm exec nuxt dev --host "$HOST" --port "$PORT" &
NUXT_PID=$!

if ! pnpm exec wait-on "http://$HOST:$PORT" --interval 2000; then
  echo "Error: Nuxt server did not start in time."
  cleanup
  exit 1
fi

echo "Nuxt server is running, starting Vitest with API base URL: http://$HOST:$PORT"

# Запуск тестов Vitest
if ! pnpm test:server; then
  echo "Vitest failed"
  cleanup
  exit 1
fi

echo "Vitest finished successfully"

# Остановка сервера
cleanup
