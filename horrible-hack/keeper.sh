#!/usr/bin/sh

set -eu

while [ 1 ];do
    date | tr -d '\n'
    echo -n "COPYing..."
    cp -R "${LOCAL_DIR}" "${REFERENCE_DIR}"
    date | tr -d '\n'
    echo "COPY done"
    sleep 60
done
