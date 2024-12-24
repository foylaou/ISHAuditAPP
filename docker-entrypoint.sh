#!/bin/sh
set -e

# 處理運行時的 API URL 更新
if [ -n "$RUNTIME_API_URL" ]; then
    echo "Updating API URL to: $RUNTIME_API_URL"
    export NEXT_PUBLIC_API_URL=$RUNTIME_API_URL
fi

# 執行後續命令
exec "$@"
