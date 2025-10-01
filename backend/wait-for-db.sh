#!/bin/sh
# wait-for.sh

set -e

host="$1"
port="$2"
shift 2
cmd="$@"

until nc -z "$host" "$port"; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 2
done

>&2 echo "Postgres is up - executing command"
exec $cmd
