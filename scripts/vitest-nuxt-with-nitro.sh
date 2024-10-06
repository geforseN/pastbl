#!/usr/bin/env bash

function cleanup {
  echo "Stopping Nuxt server..."
  kill $NUXT_PID
  exit 1
}

echo "Starting Nuxt server..."
nuxt dev --host localhost --port 5555 &
NUXT_PID=$!

pnpm exec wait-on http://localhost:5555 --interval 2000 || cleanup

echo "Nuxt server is running, starting Vitest..."
vitest --config=vitest.nuxt.config.ts || cleanup
echo "Vitest finished successfully, stopping Nuxt server..."

kill $NUXT_PID
