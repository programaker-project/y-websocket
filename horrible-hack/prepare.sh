#!/usr/bin/sh

set -eux

if [ ! -d "${REFERENCE_DIR}" ]; then
    mkdir -p "${REFERENCE_DIR}"
fi
cp -Rv "${REFERENCE_DIR}" "${LOCAL_DIR}"
