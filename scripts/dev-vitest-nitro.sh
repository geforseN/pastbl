#!/usr/bin/env bash

function cleanup {
  echo "Stopping Nuxt server..."
  kill $NUXT_PID
  exit 1
}

echo "Starting Nuxt server..."
pnpm exec nuxt dev --host 127.0.0.1 --port 3000 &
NUXT_PID=$!

pnpm exec wait-on http://127.0.0.1:3000 --interval 2000 || cleanup

echo "Nuxt server is running, starting Vitest..."
BASE_URL=http://127.0.0.1:3000 pnpm exec vitest --config vitest/server-api/vitest.config.ts || cleanup
echo "Vitest finished successfully, stopping Nuxt server..."

kill $NUXT_PID
