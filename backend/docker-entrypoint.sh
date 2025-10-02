#!/bin/sh
set -e

echo "Waiting for Postgres..."
./wait-for.sh db 5432

echo "Running migrations..."
pnpm run migrate

echo "Starting app..."
exec pnpm run dev
