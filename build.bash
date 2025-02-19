#!/bin/bash

# 1. 構建 Next.js 應用
npm run build

# 2. 確保靜態文件可被存取
mkdir -p .next/standalone/public
cp -R .next/static .next/standalone/.next/
cp -R public/* .next/standalone/public/

# 3. 啟動應用
cd .next/standalone
NODE_ENV=production node server.js
