# 使用 Node.js 作為基底鏡像
FROM node:18-alpine AS base

# 設定工作目錄
WORKDIR /app

# 複製 yarn.lock 和 package.json
COPY package.json yarn.lock ./

# 安裝依賴套件
RUN yarn install --frozen-lockfile

# 複製專案的所有檔案
COPY . .

# 環境變數 (範例)
ENV NEXT_PUBLIC_API_URL=https://api.example.com
ENV NEXT_PUBLIC_APP_NAME=MyNextApp

# 編譯 Next.js 應用程式
RUN yarn build
# 正式執行階段，使用較小的鏡像
FROM node:18-alpine AS runtime
# 設定工作目錄
WORKDIR /app
# 複製編譯後的檔案
COPY --from=base /app/.next ./.next
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/yarn.lock ./
COPY --from=base /app/package.json ./
COPY --from=base /app/public ./public
# 使用環境變數執行 Next.js
ENV NODE_ENV=production
# 開啟執行埠
EXPOSE 3000
# 啟動應用程式
CMD ["yarn", "start"]
