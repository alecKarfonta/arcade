#!/usr/bin/env bash
set -euo pipefail
SYSTEM_ROOT="${SYSTEM_ROOT:-${HOME}/git/system}"
exec "${SYSTEM_ROOT}/scripts/deploy-app.sh" arcade "${1:-deploy}"
