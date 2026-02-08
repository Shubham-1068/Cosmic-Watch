#!/bin/sh
set -e

RENDER_PORT="${PORT:-3000}"
BACKEND_PORT="${BACKEND_PORT:-8000}"

export PORT="$BACKEND_PORT"
cd /app/backend
npx prisma migrate deploy
node /app/backend/index.js &
BACKEND_PID=$!

export PORT="$RENDER_PORT"
cd /app/frontend
npm start &
FRONTEND_PID=$!

trap 'kill $BACKEND_PID $FRONTEND_PID' INT TERM
wait $BACKEND_PID $FRONTEND_PID
