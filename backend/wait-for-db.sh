#!/bin/sh

# exit immediately after if any command fails
set -e

# Takes the first argument passed to script and stores it in host
host="$1"
# Takes the second argument passed to script and stores it in host
port="$2"
shift 2
# holds the actual command u want to run
cmd="$@"
# create a simple loop to retry until sucessful
# check if portress is listening on default port 5432
until nc -z "$host" "$port"; do
# print message to stderr
  >&2 echo "Postgres is unavailable - sleeping"
  # Wait 2 seconds before trying again thus not spamming non stop
  sleep 2
done

>&2 echo "Postgres is up - executing command"
# execute the command passed
exec $cmd
