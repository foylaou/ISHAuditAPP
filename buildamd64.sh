#!/bin/bash

# 停止腳本遇到錯誤時退出
set -e

# 配置參數
IMAGE_NAME="s225002731650/ishafrontend"
TAG="1"
PLATFORM="linux/amd64"
NEXT_PUBLIC_API_URL="https://test-api.isafe.org.tw"
NEXT_PUBLIC_DOMAIN="https://test.isafe.org.tw"



# 構建映像
echo "正在建立docker image $IMAGE_NAME $PLATFORM..."
docker buildx build \
  --platform $PLATFORM \
  -t $IMAGE_NAME:$TAG \
  --build-arg $NEXT_PUBLIC_API_URL \
  --build-arg $NEXT_PUBLIC_DOMAIN \
  --load \
  .

# 推送映像到 Docker Hub
echo "正在將docker image $IMAGE_NAME 推送到 Docker Hub..."
docker push $IMAGE_NAME:$TAG

echo "Docker image $IMAGE_NAME:$TAG 完成推送"
