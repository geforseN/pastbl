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
VITEST_SERVER_API_BASE_URL=http://127.0.0.1:3000 pnpm test:server
TEST_EXIT_CODE=$?

echo "Stopping Nuxt server..."
kill $NUXT_PID

if [ $TEST_EXIT_CODE -ne 0 ]; then
echo "Vitest failed"
exit $TEST_EXIT_CODE
else
echo "Vitest finished successfully"
fi

echo "Vitest finished successfully, stopping Nuxt server..."
kill $NUXT_PID
